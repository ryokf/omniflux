use crate::{
    config::db,
    models::{asset, sea_orm_active_enums::AssetType},
};
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set};
use std::error::Error;

pub async fn usd_seeder() -> Result<(), Box<dyn Error>> {
    let db_conn = db::db_state().await;
    let ticker = "USDIDR=X";

    // 1. Cek apakah data USDIDR=X sudah ada di database
    let existing_usd = asset::Entity::find()
        .filter(asset::Column::TickerSymbol.eq(ticker))
        .one(&db_conn.db)
        .await?;

    if existing_usd.is_some() {
        println!("✅ Data USDIDR=X sudah ada di database, melewati proses seeding.");
        return Ok(());
    }

    println!("⏳ Memulai proses seeding data USD...");

    // 2. Buat ActiveModel untuk nilai tukar USD ke IDR
    let active_model = asset::ActiveModel {
        ticker_symbol: Set(ticker.to_string()),
        name: Set("US Dollar".to_string()),
        // Dititipkan sementara ke Crypto karena tipe Fiat/Forex belum ada di enum migrasi
        asset_type: Set(AssetType::Fiat),
        current_price: Set(rust_decimal::Decimal::new(0, 0)),
        unit: Set("IDR".to_string()),
        last_update: Set(Some(chrono::Utc::now())),
        ..Default::default()
    };

    // 3. Eksekusi penyimpanan ke MySQL
    active_model.insert(&db_conn.db).await?;

    println!("🚀 Berhasil melakukan seeding USDIDR=X ke database!");

    Ok(())
}
