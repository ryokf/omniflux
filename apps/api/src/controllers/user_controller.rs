use axum::{ Json, extract::{ State } };
use crate::{ dto::user_dto::CreateUserDto, models::user::{ Model as User } };

use crate::config::db::AppState;

pub async fn register(
    State(state): State<AppState>,
    Json(request): Json<CreateUserDto>
) -> Json<User> {
    crate::services::user_service::register(request, State(state)).await
}
