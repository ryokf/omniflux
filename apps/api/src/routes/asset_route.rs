use axum::{Router, routing::get};

use crate::{config::db::AppState, controllers::asset_controller::{get_latest_price, get_assets}};

pub fn asset_router() -> Router<AppState> {
    Router::new()
        .route("/", get(get_assets))
        .route("/quote/{ticker}", get(get_latest_price))
}
