use crate::{
    config::db::AppState,
    dto::user_dto::CreateUserDto,
    models::user::{ ActiveModel, Model },
};
use axum::{ Json, extract::{ State } };
use sea_orm::{ ActiveModelTrait, ActiveValue::Set };

pub async fn register(data: CreateUserDto, state: State<AppState>) -> Json<Model> {
    let new_user = ActiveModel {
        email: Set(data.email),
        password_hash: Set(data.password_hash),
        ..Default::default()
    };

    let inserted_user = new_user.insert(&state.db).await.unwrap();

    Json(inserted_user)
}
