use axum::{Router, routing::{get, post}};

use crate::{config::db::AppState, controllers::transaction_controller};

pub fn transaction_router() -> Router<AppState> {
    Router::new().route("/", get(transaction_controller::get_transactions).post(transaction_controller::create_transaction))
}

