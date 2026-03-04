use sea_orm::{Database, DatabaseConnection};
use std::env;

#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
}

pub async  fn db_state() -> AppState {
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL harus diatur di .env");

    let db = Database::connect(&db_url).await.expect("Failed to connect");

    AppState{db}
}