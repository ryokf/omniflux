use crate::{ config::db, models::{ asset, sea_orm_active_enums::AssetType } };
use sea_orm::{ EntityTrait, PaginatorTrait, Set, prelude::Decimal };
use serde::Deserialize;
use std::error::Error;
use chrono::Utc;

// Struct ini menyesuaikan dengan nama kolom persis yang ada di CSV Anda
#[derive(Debug, Deserialize)]
struct StockRecord {
    #[serde(rename = "Kode")]
    kode: String,
    #[serde(rename = "Nama Perusahaan")]
    nama_perusahaan: String,
}

pub async fn idx_stock_seeder() -> Result<(), Box<dyn Error>> {
    let db_conn = db::db_state().await;

    // 1. Cek apakah tabel asset sudah memiliki data agar tidak duplikat
    let count = asset::Entity::find().count(&db_conn.db).await?;
    if count > 0 {
        println!("✅ Data saham sudah ada di database, melewati proses seeding.");
        return Ok(());
    }

    println!("⏳ Memulai proses seeding data saham IDX...");

    // 2. Buka dan baca file CSV
    let mut rdr = csv::Reader::from_path("src/data/saham_idx.csv")?;
    let mut assets_to_insert = Vec::new();

    // 3. Looping untuk setiap baris data di CSV
    for result in rdr.deserialize() {
        let record: StockRecord = result?;

        // Transformasi kode emiten dengan menambahkan suffix '.JK'
        let ticker = format!("{}.JK", record.kode);

        // Bentuk ActiveModel SeaORM
        let active_model = asset::ActiveModel {
            ticker_symbol: Set(ticker),
            name: Set(record.nama_perusahaan),
            asset_type: Set(AssetType::Stock),
            current_price: Set(Decimal::new(0, 0)),
            unit: Set("Lembar".to_string()),
            last_update: Set(Some(Utc::now())),
            ..Default::default()
        };

        assets_to_insert.push(active_model);
    }

    // 4. Eksekusi Bulk Insert jika ada data
    if !assets_to_insert.is_empty() {
        // SeaORM insert_many sangat efisien untuk data dalam jumlah besar
        asset::Entity::insert_many(assets_to_insert).exec(&db_conn.db).await?;

        println!("🚀 Berhasil melakukan seeding saham Indonesia ke database!");
    }

    Ok(())
}
