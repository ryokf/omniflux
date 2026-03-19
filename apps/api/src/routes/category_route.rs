use axum::{ Router, routing::get };
use crate::{ config::db::AppState, controllers::category_controller };

pub fn category_router() -> Router<AppState> {
    Router::new().route("/", get(category_controller::get_categories))
}
