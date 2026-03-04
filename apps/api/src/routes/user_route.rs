use axum::{ Router, routing::post };

use crate::{ config::db::AppState, controllers::user_controller::register };

pub fn user_router() -> Router<AppState> {
    Router::new().route("/register", post(register))

    // Router::new().nest("/user", user_routes)
}
