use axum::{ Json, extract::State, http::StatusCode };
use crate::{ dto::user_dto::CreateUserDto, models::user::{ Model as User } };

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
