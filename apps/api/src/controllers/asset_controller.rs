use axum::{ Json, extract::Path, http::StatusCode };

use crate::{ dto::api_response::ApiResponse, services::asset_service };

pub async fn get_latest_price(Path(ticker): Path<String>) -> Result<
    Json<ApiResponse<f64>>,
    (StatusCode, Json<ApiResponse<()>>)
> {
    match asset_service::get_latest_price(&ticker).await {
        Ok(price) => Ok(Json(ApiResponse::success("Retrieved latest price successfully", price))),
        Err(e) => {
            let message = format!("Failed to get latest price for {}: {}", ticker, e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::error(&message))))
        }
    }
}
