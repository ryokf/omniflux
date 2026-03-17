use crate::models::asset;
use chrono::{Duration, Utc};
use rust_decimal::Decimal;
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

/// Mengambil kurs USD/IDR dari cache database.
/// Jika data kedaluwarsa (>1 hari) atau belum ada, akan memanggil Yahoo Finance.
async fn get_usd_to_idr_rate(
    db: &DatabaseConnection,
) -> Result<Decimal, Box<dyn std::error::Error>> {
    let asset_model = asset::Entity::find()
        .filter(asset::Column::TickerSymbol.eq("USDIDR=X"))
        .one(db)
        .await?
        .ok_or("Aset USDIDR=X tidak ditemukan di database. Jalankan usd_seeder terlebih dahulu.")?;

    // Evaluasi apakah cache perlu diperbarui
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
        // Panggil Yahoo Finance untuk mendapatkan kurs terbaru
        let provider = yahoo_finance_api::YahooConnector::new()?;
        let response = provider.get_latest_quotes("USDIDR=X", "1d").await?;
        let quote = response.last_quote()?;

        let new_rate =
            Decimal::from_f64_retain(quote.close).ok_or("Gagal mengonversi kurs ke Decimal")?;

        // Update cache di database
        let mut active: asset::ActiveModel = asset_model.into();
        active.current_price = Set(new_rate);
        active.last_update = Set(Some(Utc::now()));
        active.update(db).await?;

        Ok(new_rate)
    } else {
        Ok(asset_model.current_price)
    }
}

/// Mengonversi jumlah USD ke IDR menggunakan kurs ter-cache.
pub async fn usd_to_idr_convert(
    usd_amount: Decimal,
    db: &DatabaseConnection,
) -> Result<Decimal, Box<dyn std::error::Error>> {
    let rate = get_usd_to_idr_rate(db).await?;
    Ok(usd_amount * rate)
}
