use axum::{ Router, routing::get };

use crate::{ config::db::AppState, controllers::asset_controller::get_latest_price };

pub fn asset_router() -> Router<AppState> {
    Router::new().route("/quote/{ticker}", get(get_latest_price))
}
