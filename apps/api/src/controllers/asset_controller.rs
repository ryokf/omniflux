use axum::{ Json, extract::{ Path, State }, http::StatusCode };
use rust_decimal::Decimal;

use crate::{ config::db::AppState, dto::api_response::ApiResponse, services::asset_service };

pub async fn get_latest_price(
    State(state): State<AppState>,
    Path(ticker): Path<String>
) -> Result<Json<ApiResponse<Decimal>>, (StatusCode, Json<ApiResponse<()>>)> {
    match asset_service::get_latest_price(&ticker, &state.db).await {
        Ok(price) => Ok(Json(ApiResponse::success("Retrieved latest price successfully", price))),
        Err(e) => {
            let message = format!("Failed to get latest price for {}: {}", ticker, e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::error(&message))))
        }
    }
}
