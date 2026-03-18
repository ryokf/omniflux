use axum::{Json, extract::State, http::StatusCode};
use crate::{
    config::db::AppState,
    dto::api_response::ApiResponse,
    models::category::Model as Category,
    services::category_service,
    dto::user_dto::Jwt,
};

pub async fn get_categories(
    State(state): State<AppState>,
    _jwt: Jwt,
) -> Result<Json<ApiResponse<Vec<Category>>>, (StatusCode, Json<ApiResponse<()>>)> {
    match category_service::get_categories(&state.db).await {
        Ok(categories) => Ok(Json(ApiResponse::success(
            "Categories retrieved successfully",
            categories,
        ))),
        Err(e) => {
            let message = format!("Failed to retrieve categories: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}
