use axum::Router;

use crate::config::{ self };

pub mod user_route;
pub mod wallet_route;

pub async fn create_router() -> Router {
    let api_route = Router::new()
        .nest("/users", user_route::user_router())
        .nest("/wallets", wallet_route::wallet_router());

    Router::new().nest("/api/v1", api_route).with_state(config::db::db_state().await)
}
