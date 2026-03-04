mod config;
mod models;

use axum::{ Router, routing::{ get } };
use dotenvy::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let app = Router::new()
        .route("/", get("Welcome to OmniFlux API"))
        .with_state(config::db::db_state().await);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000").await.unwrap();

    println!("server running on http://localhost:4000");
    axum::serve(listener, app).await.unwrap();
}
