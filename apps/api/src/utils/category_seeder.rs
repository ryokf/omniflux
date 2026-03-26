use crate::{config::db, models::category, models::sea_orm_active_enums::Type};
use sea_orm::{EntityTrait, Set};
use std::error::Error;

pub async fn category_seeder() -> Result<(), Box<dyn Error>> {
    let db_conn = db::db_state().await;

    let categories = vec![
        ("Gaji", Type::Income),
        ("Bonus", Type::Income),
        ("Investasi", Type::Income),
        ("Pemberian", Type::Income),
        ("Lainnya (Pemasukan)", Type::Income),
        ("Makanan", Type::Expense),
        ("Transportasi", Type::Expense),
        ("Belanja", Type::Expense),
        ("Tagihan", Type::Expense),
        ("Hiburan", Type::Expense),
        ("Kesehatan", Type::Expense),
        ("Pendidikan", Type::Expense),
        ("Lainnya (Pengeluaran)", Type::Expense),
    ];

    // Cek apakah category sudah ada di database
    let existing = category::Entity::find()
        .all(&db_conn.db)
        .await?;

    if !existing.is_empty() {
        println!("✅ Category defaults sudah ada di database, melewati proses seeding.");
        return Ok(());
    }

    println!("⏳ Memulai proses seeding category default...");

    for (name, category_type) in categories {
        let active_model = category::ActiveModel {
            name: Set(name.to_string()),
            r#type: Set(category_type.clone()),
            ..Default::default()
        };

        category::Entity::insert(active_model).exec(&db_conn.db).await?;
    }

    println!("🚀 Berhasil melakukan seeding category default ke database!");

    Ok(())
}
