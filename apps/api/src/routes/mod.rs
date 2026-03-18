use axum::Router;



pub mod asset_route;
pub mod portfolio_route;
pub mod transaction_route;
pub mod user_route;
pub mod wallet_route;
pub mod category_route;

pub async fn create_router(state: crate::config::db::AppState) -> Router {
    let api_route = Router::new()
        .nest("/users", user_route::user_router())
        .nest("/wallets", wallet_route::wallet_router())
        .nest("/assets", asset_route::asset_router())
        .nest("/portfolios", portfolio_route::portfolio_router())
        .nest("/transactions", transaction_route::transaction_router())
        .nest("/insights", insight_route::insight_router())
        .nest("/categories", category_route::category_router());

    Router::new().nest("/api/v1", api_route).with_state(state)
}

pub mod insight_route;
