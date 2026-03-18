use axum::{Json, extract::State, http::StatusCode};

use crate::{
    config::db::AppState,
    dto::{api_response::ApiResponse, transaction_dto::CreateTransactionDto, user_dto::Jwt},
    models::transaction::Model as Transaction,
    services::transaction_service,
};



#[axum::debug_handler]
pub async fn create_transaction(
    State(state): State<AppState>,
    jwt: Jwt,
    Json(request): Json<CreateTransactionDto>,
) -> Result<Json<ApiResponse<Transaction>>, (StatusCode, Json<ApiResponse<()>>)> {
    match transaction_service::create_transaction(request, jwt.sub, &state.db).await {
        Ok(transaction) => Ok(Json(ApiResponse::success(
            "Transaction created successfully",
            transaction,
        ))),
        Err(e) => {
            let message = format!("Failed to create transaction: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}

pub async fn get_transactions(
    State(state): State<AppState>,
    jwt: Jwt,
) -> Result<Json<ApiResponse<Vec<Transaction>>>, (StatusCode, Json<ApiResponse<()>>)> {
    match transaction_service::get_transactions_by_user(jwt.sub, &state.db).await {
        Ok(txs) => Ok(Json(ApiResponse::success(
            "Transactions retrieved successfully",
            txs,
        ))),
        Err(e) => {
            let message = format!("Failed to retrieve transactions: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}
