use axum::{
    Router,
    routing::{get, patch},
};

use crate::{config::db::AppState, controllers::insight_controller};

pub fn insight_router() -> Router<AppState> {
    Router::new()
        .route("/", get(insight_controller::get_insights))
        .route(
            "/{insight_id}/read",
            patch(insight_controller::mark_as_read),
        )
}
