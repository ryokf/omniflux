use rust_decimal::Decimal;
use serde::Deserialize;

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
