use axum::{ Json, extract::State, http::StatusCode };
use crate::{
    dto::user_dto::{ AuthResponseDto, CreateUserDto, UserLoginDto },
    models::user::Model as User,
};

use crate::config::db::AppState;

pub async fn register(
    State(state): State<AppState>,
    Json(request): Json<CreateUserDto>
) -> Result<Json<User>, (StatusCode, String)> {
    match crate::services::user_service::register(request, State(state)).await {
        Ok(new_user) => Ok(Json(new_user)),
        Err(e) => {
            let message = format!("Failed to register : {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, message))
        }
    }
}

pub async fn login(
    State(state): State<AppState>,
    Json(request): Json<UserLoginDto>
) -> Result<Json<AuthResponseDto>, (StatusCode, String)> {
    match crate::services::user_service::login(request, State(state)).await {
        Ok(token) => Ok(Json(token)),
        Err(e) => {
            let message = format!("Failed to login : {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, message))
        }
    }
}
