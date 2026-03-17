use crate::{config::db, models::user};
use bcrypt::{DEFAULT_COST, hash};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, Set};
use std::error::Error;

pub async fn user_seeder() -> Result<(), Box<dyn Error>> {
    let db_conn = db::db_state().await;

    let email = "ryokf@gmail.com";

    // Cek apakah user sudah ada di database
    let existing = user::Entity::find()
        .filter(user::Column::Email.eq(email))
        .one(&db_conn.db)
        .await?;

    if existing.is_some() {
        println!("✅ User default sudah ada di database, melewati proses seeding.");
        return Ok(());
    }

    println!("⏳ Memulai proses seeding user default...");

    let password_hash =
        hash("rahasia123", DEFAULT_COST).map_err(|e| format!("Gagal hash password: {}", e))?;

    let active_model = user::ActiveModel {
        email: Set(email.to_string()),
        password_hash: Set(password_hash),
        ..Default::default()
    };

    user::Entity::insert(active_model).exec(&db_conn.db).await?;

    println!("🚀 Berhasil melakukan seeding user default ke database!");

    Ok(())
}
