use axum::{routing::post, Router};

use crate::{
    config::db::AppState,
    controllers::transaction_controller,
};

pub fn transaction_router() -> Router<AppState> {
    Router::new()
        .route("/", post(transaction_controller::create_transaction))
}
