use crate::{
    config::db::AppState,
    dto::user_dto::{ CreateUserDto, UserLoginDto },
    models::user::{ ActiveModel, Column, Entity, Model },
};
use axum::{ extract::{ State } };
use bcrypt::{ DEFAULT_COST, hash };
use sea_orm::{ ActiveModelTrait, ActiveValue::Set, ColumnTrait, DbErr, EntityTrait, QueryFilter };

pub async fn register(data: CreateUserDto, state: State<AppState>) -> Result<Model, DbErr> {
    let hashed_password = match hash(data.password, DEFAULT_COST) {
        Ok(h) => h,
        Err(e) => {
            let message = format!("Failed to encrypt : {}", e);
            return Err(DbErr::Custom(message));
        }
    };

    let new_user = ActiveModel {
        email: Set(data.email),
        password_hash: Set(hashed_password),
        ..Default::default()
    };

    new_user.insert(&state.db).await
}

pub async fn login(data: UserLoginDto, state: State<AppState>) -> Result<Option<Model>, DbErr> {
    let user = Entity::find().filter(Column::Email.eq(data.email)).one(&state.db).await;

    return user;
}
