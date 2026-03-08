use axum::{ Json, extract::{ Path, State }, http::StatusCode };

use crate::{
    config::db::AppState,
    dto::wallet_dto::CreateWalletDto,
    models::wallet::Model as Wallet,
    services::wallet_service,
};

pub async fn get_wallet_by_user_id(
    State(state): State<AppState>,
    Path(user_id): Path<i32>
) -> Result<Json<Wallet>, (StatusCode, String)> {
    match wallet_service::get_wallet_by_user_id(user_id, State(state)).await {
        Ok(wallet) => Ok(Json(wallet)),
        Err(e) => {
            let message = format!("Failed to register : {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, message))
        }
    }
}

pub async fn create_wallet(
    State(state): State<AppState>,
    Json(request): Json<CreateWalletDto>
) -> Result<Json<Wallet>, (StatusCode, String)> {
    match wallet_service::create_wallet(request, State(state)).await {
        Ok(wallet) => Ok(Json(wallet)),
        Err(e) => {
            let message = format!("Failed to register : {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, message))
        }
    }
}
