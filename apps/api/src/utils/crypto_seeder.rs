use crate::{ config::db, models::{ asset, sea_orm_active_enums::AssetType } };
use sea_orm::{ EntityTrait, PaginatorTrait, Set, ColumnTrait, QueryFilter };
use serde::Deserialize;
use std::error::Error;

// Struct ini dipetakan langsung ke header file CSV dari Yahoo Finance
#[derive(Debug, Deserialize)]
struct CryptoRecord {
    #[serde(rename = "Symbol")]
    symbol: String,
    #[serde(rename = "Name")]
    name: String,
}

pub async fn crypto_seeder() -> Result<(), Box<dyn Error>> {
    let db_conn = db::db_state().await;

    // 1. Pengecekan Data Eksisting
    // Kita filter spesifik untuk tipe Crypto agar tidak bentrok dengan jumlah saham IDX
    let count = asset::Entity
        ::find()
        .filter(asset::Column::AssetType.eq(AssetType::Crypto))
        .count(&db_conn.db).await?;

    if count > 0 {
        println!("✅ Data kripto sudah ada di database, melewati proses seeding.");
        return Ok(());
    }

    println!("⏳ Memulai proses seeding Top 200 aset Kripto...");

    // 2. Membaca file CSV
    // Pastikan path ini sesuai dengan lokasi file CSV Anda di dalam project
    let mut rdr = csv::Reader::from_path("src/data/cryptocurrency.csv")?;
    let mut assets_to_insert = Vec::new();

    // 3. Iterasi Data dengan Batasan (Limit Top 200)
    for (index, result) in rdr.deserialize::<CryptoRecord>().enumerate() {
        // Hentikan proses jika indeks sudah mencapai 200
        if index >= 200 {
            break;
        }

        // Lakukan parsing baris CSV ke dalam struct CryptoRecord
        if let Ok(record) = result {
            let active_model = asset::ActiveModel {
                // Ticker langsung dimasukkan karena formatnya sudah "BTC-USD"
                ticker_symbol: Set(record.symbol),
                name: Set(record.name),
                asset_type: Set(AssetType::Crypto),
                ..Default::default()
            };

            assets_to_insert.push(active_model);
        } else {
            // Memberikan log peringatan jika ada baris yang gagal dibaca
            eprintln!("Peringatan: Gagal mem-parsing baris ke-{}", index + 1);
        }
    }

    // 4. Eksekusi Bulk Insert
    if !assets_to_insert.is_empty() {
        let total_inserted = assets_to_insert.len();

        asset::Entity::insert_many(assets_to_insert).exec(&db_conn.db).await?;

        println!("🚀 Berhasil melakukan seeding {} aset kripto teratas ke database!", total_inserted);
    } else {
        println!("⚠️ Tidak ada data kripto yang valid untuk dimasukkan.");
    }

    Ok(())
}
