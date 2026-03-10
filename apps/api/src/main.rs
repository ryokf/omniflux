mod config;
mod models;
mod controllers;
mod services;
mod routes;
mod dto;
mod middleware;
mod utils;

use dotenvy::dotenv;
use crate::utils::idx_stock_seeder::idx_stock_seeder;

#[tokio::main]
async fn main() {
    dotenv().ok();

    if let Err(e) = idx_stock_seeder().await {
        eprintln!("Gagal melakukan seeding saham: {}", e);
    }

    let app = routes::create_router().await;
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000").await.unwrap();

    println!("server running on http://localhost:4000");
    axum::serve(listener, app).await.unwrap();
}
