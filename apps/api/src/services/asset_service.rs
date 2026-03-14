use crate::models::asset::{ self, Model };
use crate::utils::usd_to_idr_convert::usd_to_idr_convert;
use chrono::{ Duration, Utc };
use rust_decimal::Decimal;
use rust_decimal::prelude::FromPrimitive;
use sea_orm::{
    ActiveModelTrait,
    ColumnTrait,
    DatabaseConnection,
    DbErr,
    EntityTrait,
    QueryFilter,
    Set,
};

pub async fn get_latest_price(
    ticker: &str,
    db: &DatabaseConnection
) -> Result<Decimal, Box<dyn std::error::Error>> {
    let asset_model = asset::Entity
        ::find()
        .filter(asset::Column::TickerSymbol.eq(ticker))
        .one(db).await?
        .ok_or_else(|| format!("Aset dengan ticker '{}' tidak ditemukan di database.", ticker))?;

    let zero = Decimal::new(0, 0);
    let mut needs_update = false;

    if asset_model.current_price == zero {
        needs_update = true;
    }

    match asset_model.last_update {
        None => {
            needs_update = true;
        }
        Some(last) => {
            if Utc::now().signed_duration_since(last) > Duration::days(1) {
                needs_update = true;
            }
        }
    }

    if needs_update {
        let provider = yahoo_finance_api::YahooConnector::new()?;
        let response = provider.get_latest_quotes(ticker, "1d").await?;
        let quote = response.last_quote()?;

        let raw_price = Decimal::from_f64(quote.close).ok_or("Gagal mengonversi harga ke Decimal")?;

        let final_price = if ticker == "GC=F" {
            let idr_price = usd_to_idr_convert(raw_price, db).await?;
            let troy_to_gram = Decimal::from_f64(31.1035).ok_or(
                "Gagal mengonversi konstanta troy oz"
            )?;
            idr_price / troy_to_gram
        } else {
            let last_two = if ticker.len() >= 2 { &ticker[ticker.len() - 2..] } else { ticker };

            if last_two == "JK" {
                raw_price
            } else {
                usd_to_idr_convert(raw_price, db).await?
            }
        };
        let mut active: asset::ActiveModel = asset_model.into();
        active.current_price = Set(final_price);
        active.last_update = Set(Some(Utc::now()));
        active.update(db).await?;

        Ok(final_price)
    } else {
        Ok(asset_model.current_price)
    }
}

pub async fn get_asset_by_id(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    let asset_model = asset::Entity
        ::find()
        .filter(asset::Column::Id.eq(id))
        .one(db).await?
        .ok_or_else(||
            DbErr::Custom(format!("Aset dengan ID '{}' tidak ditemukan di database.", id))
        )?;

    Ok(asset_model)
}
