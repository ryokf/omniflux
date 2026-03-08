use crate::{
    config::db::AppState,
    dto::user_dto::{ AuthResponseDto, CreateUserDto, Jwt, UserLoginDto },
    models::user::{ ActiveModel, Column, Entity, Model },
};
use axum::{ extract::{ State } };
use bcrypt::{ DEFAULT_COST, hash, verify };
use chrono::{ Duration, Utc };
use jsonwebtoken::{ EncodingKey, Header, encode };
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

pub async fn login(data: UserLoginDto, state: State<AppState>) -> Result<AuthResponseDto, String> {
    let user_opt = Entity::find()
        .filter(Column::Email.eq(data.email))
        .one(&state.db).await
        .map_err(|e| format!("Database error: {}", e))?;

    if let Some(user) = user_opt {
        let exp = Utc::now()
            .checked_add_signed(Duration::days(7))
            .expect("Waktu tidak valid")
            .timestamp() as usize;

        let is_valid = match verify(&data.password, &user.password_hash) {
            Ok(valid) => valid,
            Err(_) => false,
        };

        if is_valid {
            let jwt_claim = Jwt {
                sub: user.id,
                exp: exp,
            };

            let secret = "rahasia123";

            let token = encode(
                &Header::default(),
                &jwt_claim,
                &EncodingKey::from_secret(secret.as_ref())
            ).map_err(|_| "Gagal membuat token autentikasi".to_string())?;

            Ok(AuthResponseDto { token: token })
        } else {
            Err("password salah".to_string())
        }
    } else {
        Err("Email salah".to_string())
    }
}
