use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

use crate::{
    config::db::AppState,
    dto::{
        api_response::ApiResponse,
        portfolio_dto::{CreatePortfolioDto, UpdatePortfolioDto},
        user_dto::Jwt,
    },
    models::portfolio::Model as Portfolio,
    services::portfolio_service,
};

pub async fn get_portfolios_by_user_id(
    State(state): State<AppState>,
    _jwt: Jwt,
    Path(user_id): Path<i32>,
) -> Result<Json<ApiResponse<Vec<Portfolio>>>, (StatusCode, Json<ApiResponse<()>>)> {
    match portfolio_service::get_portfolios_by_user_id(user_id, &state.db).await {
        Ok(portfolios) => Ok(Json(ApiResponse::success(
            "Portfolios retrieved successfully",
            portfolios,
        ))),
        Err(e) => {
            let message = format!("Failed to retrieve portfolios: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}

pub async fn get_portfolio_by_id(
    State(state): State<AppState>,
    _jwt: Jwt,
    Path(id): Path<i32>,
) -> Result<Json<ApiResponse<Portfolio>>, (StatusCode, Json<ApiResponse<()>>)> {
    match portfolio_service::get_portfolio_by_id(id, &state.db).await {
        Ok(Some(portfolio)) => Ok(Json(ApiResponse::success(
            "Portfolio retrieved successfully",
            portfolio,
        ))),
        Ok(None) => Err((
            StatusCode::NOT_FOUND,
            Json(ApiResponse::error("Portfolio tidak ditemukan")),
        )),
        Err(e) => {
            let message = format!("Failed to retrieve portfolio: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}

pub async fn create_portfolio(
    State(state): State<AppState>,
    _jwt: Jwt,
    Json(request): Json<CreatePortfolioDto>,
) -> Result<Json<ApiResponse<Portfolio>>, (StatusCode, Json<ApiResponse<()>>)> {
    match portfolio_service::create_portfolio(request, &state.db).await {
        Ok(portfolio) => Ok(Json(ApiResponse::success(
            "Portfolio created successfully",
            portfolio,
        ))),
        Err(e) => {
            let message = format!("Failed to create portfolio: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}

pub async fn update_portfolio(
    State(state): State<AppState>,
    _jwt: Jwt,
    Path(id): Path<i32>,
    Json(request): Json<UpdatePortfolioDto>,
) -> Result<Json<ApiResponse<Portfolio>>, (StatusCode, Json<ApiResponse<()>>)> {
    match portfolio_service::update_portfolio(id, request, &state.db).await {
        Ok(portfolio) => Ok(Json(ApiResponse::success(
            "Portfolio updated successfully",
            portfolio,
        ))),
        Err(e) => {
            let message = format!("Failed to update portfolio: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}

pub async fn delete_portfolio(
    State(state): State<AppState>,
    _jwt: Jwt,
    Path(id): Path<i32>,
) -> Result<Json<ApiResponse<()>>, (StatusCode, Json<ApiResponse<()>>)> {
    match portfolio_service::delete_portfolio(id, &state.db).await {
        Ok(()) => Ok(Json(ApiResponse::success_without_data(
            "Portfolio deleted successfully",
        ))),
        Err(e) => {
            let message = format!("Failed to delete portfolio: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}

pub async fn get_net_worth(
    State(state): State<AppState>,
    jwt: Jwt,
) -> Result<
    Json<ApiResponse<crate::dto::portfolio_dto::NetWorthResponseDto>>,
    (StatusCode, Json<ApiResponse<()>>),
> {
    match portfolio_service::get_portfolio_net_worth(jwt.sub, &state.db).await {
        Ok(net_worth) => Ok(Json(ApiResponse::success(
            "Net worth calculated successfully",
            net_worth,
        ))),
        Err(e) => {
            let message = format!("Failed to calculate net worth: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&message)),
            ))
        }
    }
}
