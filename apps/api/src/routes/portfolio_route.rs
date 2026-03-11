use axum::{ Router, routing::{ delete, get, post, put } };

use crate::{
    config::db::AppState,
    controllers::portfolio_controller::{
        create_portfolio, delete_portfolio, get_portfolio_by_id, get_portfolios_by_user_id,
        update_portfolio,
    },
};

pub fn portfolio_router() -> Router<AppState> {
    Router::new()
        .route("/user/{user_id}", get(get_portfolios_by_user_id))
        .route("/{id}", get(get_portfolio_by_id))
        .route("/", post(create_portfolio))
        .route("/{id}", put(update_portfolio))
        .route("/{id}", delete(delete_portfolio))
}
