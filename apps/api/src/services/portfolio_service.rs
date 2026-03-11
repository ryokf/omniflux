use crate::{
    dto::portfolio_dto::{ CreatePortfolioDto, UpdatePortfolioDto },
    models::portfolio::{ ActiveModel, Column, Entity, Model },
};
use chrono::Utc;
use sea_orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, DbErr, EntityTrait,
    ModelTrait, QueryFilter,
};

pub async fn get_portfolios_by_user_id(
    user_id: i32,
    db: &DatabaseConnection,
) -> Result<Vec<Model>, DbErr> {
    Entity::find()
        .filter(Column::UserId.eq(user_id))
        .all(db)
        .await
}

pub async fn get_portfolio_by_id(
    id: i32,
    db: &DatabaseConnection,
) -> Result<Option<Model>, DbErr> {
    Entity::find_by_id(id).one(db).await
}

pub async fn create_portfolio(
    data: CreatePortfolioDto,
    db: &DatabaseConnection,
) -> Result<Model, DbErr> {
    // Check if portfolio for this user and asset already exists
    let existing_portfolio = Entity::find()
        .filter(Column::UserId.eq(data.user_id))
        .filter(Column::AssetId.eq(data.asset_id))
        .one(db)
        .await?;

    match existing_portfolio {
        Some(portfolio) => {
            // If exists, calculate new weighted average price and update quantity
            let mut active: ActiveModel = portfolio.into();
            
            let current_quantity = active.quantity.clone().unwrap();
            let current_price = active.price_at_purchase.clone().unwrap();
            
            let total_value_old = current_quantity * current_price;
            let total_value_new = data.quantity * data.price_at_purchase;
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
                price_at_purchase: Set(data.price_at_purchase),
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
    db: &DatabaseConnection,
) -> Result<Model, DbErr> {
    let portfolio = Entity::find_by_id(id)
        .one(db)
        .await?
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

pub async fn delete_portfolio(
    id: i32,
    db: &DatabaseConnection,
) -> Result<(), DbErr> {
    let portfolio = Entity::find_by_id(id)
        .one(db)
        .await?
        .ok_or(DbErr::RecordNotFound("Portfolio tidak ditemukan".to_string()))?;

    portfolio.delete(db).await?;
    Ok(())
}
