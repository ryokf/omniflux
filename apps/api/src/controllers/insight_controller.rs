use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

use crate::{
    config::db::AppState,
    dto::{api_response::ApiResponse, user_dto::Jwt},
    models::insight::Model as Insight,
    services::insight_service,
};

#[axum::debug_handler]
pub async fn get_insights(
    State(state): State<AppState>,
    jwt: Jwt,
) -> Result<Json<ApiResponse<Vec<Insight>>>, (StatusCode, Json<ApiResponse<()>>)> {
    match insight_service::get_unread_insights(&state.db, jwt.sub).await {
        Ok(insights) => Ok(Json(ApiResponse::success(
            "Insights retrieved successfully",
            insights,
        ))),
        Err(e) => {
            let message = format!("Failed to retrieve insights: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}

#[axum::debug_handler]
pub async fn mark_as_read(
    State(state): State<AppState>,
    Path(insight_id): Path<i32>,
    jwt: Jwt,
) -> Result<Json<ApiResponse<Insight>>, (StatusCode, Json<ApiResponse<()>>)> {
    match insight_service::mark_insight_as_read(&state.db, insight_id, jwt.sub).await {
        Ok(insight) => Ok(Json(ApiResponse::success(
            "Insight marked as read successfully",
            insight,
        ))),
        Err(e) => {
            let message = format!("Failed to mark insight as read: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}
