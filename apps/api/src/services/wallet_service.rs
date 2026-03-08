use axum::extract::State;
use sea_orm::{ ActiveModelTrait, ActiveValue::Set, DbErr };

use crate::{
    config::db::AppState,
    dto::wallet_dto::CreateWalletDto,
    models::wallet::{ ActiveModel, Model },
};

pub async fn get_wallet_by_user_id(user_id: i32, state: State<AppState>) -> Result<Model, DbErr> {
    let new_wallet = ActiveModel {
        user_id: Set(user_id),
        ..Default::default()
    };

    new_wallet.insert(&state.db).await
}

pub async fn create_wallet(data: CreateWalletDto, state: State<AppState>) -> Result<Model, DbErr> {
    let new_wallet = ActiveModel {
        user_id: Set(data.user_id),
        name: Set(data.name),
        ..Default::default()
    };

    new_wallet.insert(&state.db).await
}
