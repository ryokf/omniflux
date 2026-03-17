use crate::{
    config::db,
    models::{asset, sea_orm_active_enums::AssetType},
};
use chrono::Utc;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, Set, prelude::Decimal};
use std::error::Error;

pub async fn gold_seeder() -> Result<(), Box<dyn Error>> {
    let db_conn = db::db_state().await;

    // Cek apakah aset emas sudah ada di database
    let existing = asset::Entity::find()
        .filter(asset::Column::TickerSymbol.eq("GC=F"))
        .one(&db_conn.db)
        .await?;

    if existing.is_some() {
        println!("✅ Data emas sudah ada di database, melewati proses seeding.");
        return Ok(());
    }

    println!("⏳ Memulai proses seeding aset Emas...");

    let active_model = asset::ActiveModel {
        ticker_symbol: Set("GC=F".to_string()),
        name: Set("Emas Fisik".to_string()),
        asset_type: Set(AssetType::Commodity),
        current_price: Set(Decimal::new(0, 0)),
        unit: Set("Gram".to_string()),
        last_update: Set(Some(Utc::now())),
        ..Default::default()
    };

    asset::Entity::insert(active_model)
        .exec(&db_conn.db)
        .await?;

    println!("🚀 Berhasil melakukan seeding aset emas ke database!");

    Ok(())
}
