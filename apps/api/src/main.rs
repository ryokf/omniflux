mod config;
mod models;
mod controllers;
mod routes;

use dotenvy::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let app = routes::create_router().await;
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000").await.unwrap();

    println!("server running on http://localhost:4000");
    axum::serve(listener, app).await.unwrap();
}
