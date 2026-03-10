use axum::{ Json, extract::State, http::StatusCode };
use crate::{
    dto::{ api_response::ApiResponse, user_dto::{ AuthResponseDto, CreateUserDto, UserLoginDto } },
    models::user::Model as User,
    services::user_service,
};

use crate::config::db::AppState;

pub async fn register(
    State(state): State<AppState>,
    Json(request): Json<CreateUserDto>
) -> Result<Json<ApiResponse<User>>, (StatusCode, Json<ApiResponse<()>>)> {
    match user_service::register(request, State(state)).await {
        Ok(new_user) => Ok(Json(ApiResponse::success("User registered successfully", new_user))),
        Err(e) => {
            let message = format!("Failed to register : {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::error(&message))))
        }
    }
}

pub async fn login(
    State(state): State<AppState>,
    Json(request): Json<UserLoginDto>
) -> Result<Json<ApiResponse<AuthResponseDto>>, (StatusCode, Json<ApiResponse<()>>)> {
    match user_service::login(request, State(state)).await {
        Ok(token) => Ok(Json(ApiResponse::success("Login successful", token))),
        Err(e) => {
            let message = format!("Failed to login : {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::error(&message))))
        }
    }
}
