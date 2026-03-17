use axum::{
    Router,
    routing::{get, post},
};

use crate::{
    config::db::AppState,
    controllers::wallet_controller::{create_wallet, get_wallet_by_user_id},
};

pub fn wallet_router() -> Router<AppState> {
    Router::new()
        .route("/{user_id}", get(get_wallet_by_user_id))
        .route("/", post(create_wallet))
}
