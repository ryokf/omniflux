use axum::{ Router, routing::post };

use crate::{ config::db::AppState, controllers::user_controller::{ login, register } };

pub fn user_router() -> Router<AppState> {
    Router::new().route("/register", post(register)).route("/login", post(login))
}
