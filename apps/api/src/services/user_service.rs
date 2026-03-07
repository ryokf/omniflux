use crate::{
    config::db::AppState,
    dto::user_dto::CreateUserDto,
    models::user::{ ActiveModel, Model },
};
use axum::{ extract::{ State } };
use sea_orm::{ ActiveModelTrait, ActiveValue::Set, DbErr };

pub async fn register(data: CreateUserDto, state: State<AppState>) -> Result<Model, DbErr> {
    let new_user = ActiveModel {
        email: Set(data.email),
        password_hash: Set(data.password_hash),
        ..Default::default()
    };

    new_user.insert(&state.db).await
}
