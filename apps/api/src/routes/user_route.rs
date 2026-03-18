use axum::{Router, routing::{post, get}};

use crate::{
    config::db::AppState,
    controllers::user_controller::{login, register, get_profile},
};

pub fn user_router() -> Router<AppState> {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/me", get(get_profile))
}

