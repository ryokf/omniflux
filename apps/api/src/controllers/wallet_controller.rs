use axum::{ Json, extract::{ Path, State }, http::StatusCode };

use crate::{
    config::db::AppState,
    dto::{ api_response::ApiResponse, user_dto::Jwt, wallet_dto::CreateWalletDto },
    models::wallet::Model as Wallet,
    services::wallet_service,
};

pub async fn get_wallet_by_user_id(
    State(state): State<AppState>,
    _jwt: Jwt,
    Path(user_id): Path<i32>
) -> Result<Json<ApiResponse<Vec<Wallet>>>, (StatusCode, Json<ApiResponse<()>>)> {
    match wallet_service::get_wallet_by_user_id(user_id, State(state)).await {
        Ok(wallet) => Ok(Json(ApiResponse::success("Wallet retrieved successfully", wallet))),
        Err(e) => {
            let message = format!("Failed to retrieve wallet: {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::error(&message))))
        }
    }
}

pub async fn create_wallet(
    State(state): State<AppState>,
    _jwt: Jwt,
    Json(request): Json<CreateWalletDto>
) -> Result<Json<ApiResponse<Wallet>>, (StatusCode, Json<ApiResponse<()>>)> {
    match wallet_service::create_wallet(request, State(state)).await {
        Ok(wallet) => Ok(Json(ApiResponse::success("Wallet created successfully", wallet))),
        Err(e) => {
            let message = format!("Failed to create wallet: {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::error(&message))))
        }
    }
}
