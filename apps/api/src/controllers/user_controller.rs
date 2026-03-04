use axum::{ Json, extract::{ State } };
use sea_orm::{ ActiveModelTrait, ActiveValue::Set };
use serde::Deserialize;

use crate::{ models::user::{ Model as User, ActiveModel as UserActive } };

use crate::config::db::AppState;

#[derive(Deserialize)]
pub struct CreateUserDto {
    pub email: String,
    pub password_hash: String,
}

pub async fn register(
    State(state): State<AppState>,
    Json(request): Json<CreateUserDto>
) -> Json<User> {
    let new_user = UserActive {
        email: Set(request.email),
        password_hash: Set(request.password_hash),
        ..Default::default()
    };

    let inserted_user = new_user.insert(&state.db).await.unwrap();

    Json(inserted_user)
}
