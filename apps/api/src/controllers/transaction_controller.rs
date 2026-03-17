use axum::{Json, extract::State, http::StatusCode};

use crate::{
    config::db::AppState,
    dto::{api_response::ApiResponse, transaction_dto::CreateTransactionDto, user_dto::Jwt},
    models::transaction::Model as Transaction,
    services::transaction_service,
};

use axum::Extension;

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
