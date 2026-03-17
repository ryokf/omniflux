use crate::{
    dto::portfolio_dto::{ CreatePortfolioDto, UpdatePortfolioDto },
    models::portfolio::{ ActiveModel, Column, Entity, Model },
    services::asset_service::{ get_asset_by_id, get_latest_price },
};
use chrono::Utc;
use rust_decimal::Decimal;
use sea_orm::{
    ActiveModelTrait,
    ActiveValue::Set,
    ColumnTrait,
    DatabaseConnection,
    DbErr,
    EntityTrait,
    ModelTrait,
    QueryFilter,
};

pub async fn get_portfolios_by_user_id(
    user_id: i32,
    db: &DatabaseConnection
) -> Result<Vec<Model>, DbErr> {
    Entity::find().filter(Column::UserId.eq(user_id)).all(db).await
}

pub async fn get_portfolio_by_id(id: i32, db: &DatabaseConnection) -> Result<Option<Model>, DbErr> {
    Entity::find_by_id(id).one(db).await
}

pub async fn create_portfolio(
    data: CreatePortfolioDto,
    db: &DatabaseConnection
) -> Result<Model, DbErr> {
    // Check if portfolio for this user and asset already exists
    let existing_portfolio = Entity::find()
        .filter(Column::UserId.eq(data.user_id))
        .filter(Column::AssetId.eq(data.asset_id))
        .one(db).await?;

    let get_asset = get_asset_by_id(data.asset_id, db).await?;

    let current_asset_price = get_latest_price(&get_asset.ticker_symbol, db).await.map_err(|e|
        DbErr::Custom(e.to_string())
    )?;

    match existing_portfolio {
        Some(portfolio) => {
            // If exists, calculate new weighted average price and update quantity
            let mut active: ActiveModel = portfolio.into();

            let current_quantity = active.quantity.clone().unwrap();
            let current_price = active.price_at_purchase.clone().unwrap();

            let total_value_old = current_quantity * current_price;
            let total_value_new = data.quantity * current_asset_price;
            let total_quantity = current_quantity + data.quantity;
            let new_average_price = (total_value_old + total_value_new) / total_quantity;

            active.quantity = Set(total_quantity);
            active.price_at_purchase = Set(new_average_price);

            active.updated_at = Set(Some(Utc::now()));
            active.update(db).await
        }
        None => {
            // If doesn't exist, create new
            let new_portfolio = ActiveModel {
                user_id: Set(data.user_id),
                asset_id: Set(data.asset_id),
                quantity: Set(data.quantity),
                price_at_purchase: Set(current_asset_price),
                updated_at: Set(Some(Utc::now())),
                ..Default::default()
            };

            new_portfolio.insert(db).await
        }
    }
}

pub async fn update_portfolio(
    id: i32,
    data: UpdatePortfolioDto,
    db: &DatabaseConnection
) -> Result<Model, DbErr> {
    let portfolio = Entity::find_by_id(id)
        .one(db).await?
        .ok_or(DbErr::RecordNotFound("Portfolio tidak ditemukan".to_string()))?;

    let mut active: ActiveModel = portfolio.into();

    if let Some(quantity) = data.quantity {
        active.quantity = Set(quantity);
    }
    if let Some(price) = data.price_at_purchase {
        active.price_at_purchase = Set(price);
    }

    active.updated_at = Set(Some(Utc::now()));
    active.update(db).await
}

pub async fn delete_portfolio(id: i32, db: &DatabaseConnection) -> Result<(), DbErr> {
    let portfolio = Entity::find_by_id(id)
        .one(db).await?
        .ok_or(DbErr::RecordNotFound("Portfolio tidak ditemukan".to_string()))?;

    portfolio.delete(db).await?;
    Ok(())
}

pub async fn get_portfolio_net_worth(
    user_id: i32,
    db: &DatabaseConnection,
) -> Result<crate::dto::portfolio_dto::NetWorthResponseDto, DbErr> {
    use crate::dto::portfolio_dto::{AssetPerformanceDto, NetWorthResponseDto};
    use crate::models::{asset, portfolio, wallet};
    use futures::future::join_all;

    let portfolios = portfolio::Entity::find()
        .filter(portfolio::Column::UserId.eq(user_id))
        .find_also_related(asset::Entity)
        .all(db)
        .await?;

    let mut price_futures = Vec::new();
    for (port, asset_opt) in &portfolios {
        if let Some(asset) = asset_opt {
            let ticker = asset.ticker_symbol.clone();
            price_futures.push(async move {
                let current_price = get_latest_price(&ticker, db).await.unwrap_or(Decimal::ZERO);
                (port.asset_id, current_price, ticker)
            });
        }
    }

    let price_results = join_all(price_futures).await;

    let mut portfolio_details = Vec::new();
    let mut total_investments_value = Decimal::ZERO;
    let mut total_unrealized_pnl = Decimal::ZERO;

    for (port, asset_opt) in portfolios {
        if let Some(_asset) = asset_opt {
            let quantity = port.quantity.clone();
            let average_purchase_price = port.price_at_purchase.clone();

            let current_price = price_results
                .iter()
                .find(|(id, _, _)| *id == port.asset_id)
                .map(|(_, price, _)| *price)
                .unwrap_or(Decimal::ZERO);

            let ticker = price_results
                .iter()
                .find(|(id, _, _)| *id == port.asset_id)
                .map(|(_, _, t)| t.clone())
                .unwrap_or_default();

            let total_actual_value = current_price * quantity;
            let unrealized_pnl = (current_price - average_purchase_price) * quantity;

            total_investments_value += total_actual_value;
            total_unrealized_pnl += unrealized_pnl;

            portfolio_details.push(AssetPerformanceDto {
                asset_id: port.asset_id,
                ticker,
                quantity,
                average_purchase_price,
                current_price,
                total_actual_value,
                unrealized_pnl,
            });
        }
    }

    let user_wallets = wallet::Entity::find()
        .filter(wallet::Column::UserId.eq(user_id))
        .all(db)
        .await?;

    let mut cash_balance = Decimal::ZERO;
    for w in user_wallets {
        cash_balance += w.balance;
    }

    let total_net_worth = cash_balance + total_investments_value;

    Ok(NetWorthResponseDto {
        cash_balance,
        total_investments_value,
        total_unrealized_pnl,
        total_net_worth,
        portfolio_details,
    })
}
