use crate::models::asset;
use crate::utils::usd_to_idr_convert::usd_to_idr_convert;
use chrono::{ Duration, Utc };
use rust_decimal::Decimal;
use rust_decimal::prelude::FromPrimitive;
use sea_orm::{ ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set };

pub async fn get_latest_price(
    ticker: &str,
    db: &DatabaseConnection
) -> Result<Decimal, Box<dyn std::error::Error>> {
    // Langkah 2: Kueri aset dari database
    let asset_model = asset::Entity
        ::find()
        .filter(asset::Column::TickerSymbol.eq(ticker))
        .one(db).await?
        .ok_or_else(|| format!("Aset dengan ticker '{}' tidak ditemukan di database.", ticker))?;

    // Langkah 3: Evaluasi kondisi kedaluwarsa
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

    // Langkah 4 & 5: Panggil API eksternal jika diperlukan, lalu perbarui DB
    if needs_update {
        let provider = yahoo_finance_api::YahooConnector::new()?;
        let response = provider.get_latest_quotes(ticker, "1d").await?;
        let quote = response.last_quote()?;

        let raw_price = Decimal::from_f64(quote.close).ok_or("Gagal mengonversi harga ke Decimal")?;

        // Terapkan konversi sesuai jenis aset
        let final_price = if ticker == "GC=F" {
            // Emas: konversi USD→IDR, lalu bagi 31.1035 (troy oz → gram)
            let idr_price = usd_to_idr_convert(raw_price, db).await?;
            let troy_to_gram = Decimal::from_f64(31.1035).ok_or(
                "Gagal mengonversi konstanta troy oz"
            )?;
            idr_price / troy_to_gram
        } else {
            let last_two = if ticker.len() >= 2 { &ticker[ticker.len() - 2..] } else { ticker };

            if last_two == "JK" {
                // Saham Indonesia: harga sudah dalam IDR
                raw_price
            } else {
                // Aset lain (kripto, dll): konversi USD→IDR
                usd_to_idr_convert(raw_price, db).await?
            }
        };

        // Update cache di database
        let mut active: asset::ActiveModel = asset_model.into();
        active.current_price = Set(final_price);
        active.last_update = Set(Some(Utc::now()));
        active.update(db).await?;

        Ok(final_price)
    } else {
        // Langkah 6: Kembalikan harga dari cache
        Ok(asset_model.current_price)
    }
}
