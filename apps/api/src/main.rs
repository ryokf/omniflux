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
use crate::utils::crypto_seeder::crypto_seeder;
use crate::utils::gold_seeder::gold_seeder;
use crate::utils::usd_seeder::usd_seeder;
use crate::utils::user_seeder::user_seeder;

#[tokio::main]
async fn main() {
    dotenv().ok();

    if let Err(e) = idx_stock_seeder().await {
        eprintln!("Gagal melakukan seeding saham: {}", e);
    }

    if let Err(e) = crypto_seeder().await {
        eprintln!("Gagal melakukan seeding kripto: {}", e);
    }

    if let Err(e) = gold_seeder().await {
        eprintln!("Gagal melakukan seeding emas: {}", e);
    }

    if let Err(e) = usd_seeder().await {
        eprintln!("Gagal melakukan seeding usd: {}", e);
    }

    if let Err(e) = user_seeder().await {
        eprintln!("Gagal melakukan seeding user default: {}", e);
    }

    let app = routes::create_router().await;
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000").await.unwrap();

    println!("server running on http://localhost:4000");
    axum::serve(listener, app).await.unwrap();
}
