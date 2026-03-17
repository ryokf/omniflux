use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct CreatePortfolioDto {
    pub user_id: i32,
    pub asset_id: i32,
    pub quantity: Decimal,
}

#[derive(Deserialize)]
pub struct UpdatePortfolioDto {
    pub quantity: Option<Decimal>,
    pub price_at_purchase: Option<Decimal>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AssetPerformanceDto {
    pub asset_id: i32,
    pub ticker: String,
    pub quantity: Decimal,
    pub average_purchase_price: Decimal,
    pub current_price: Decimal,
    pub total_actual_value: Decimal,
    pub unrealized_pnl: Decimal,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NetWorthResponseDto {
    pub cash_balance: Decimal,
    pub total_investments_value: Decimal,
    pub total_unrealized_pnl: Decimal,
    pub total_net_worth: Decimal,
    pub portfolio_details: Vec<AssetPerformanceDto>,
}
