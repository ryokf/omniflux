use rust_decimal::Decimal;
use serde::Deserialize;

#[derive(Deserialize, Debug, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum TransactionType {
    Income,
    Expense,
}

#[derive(Deserialize, Debug)]
pub struct CreateTransactionDto {
    pub wallet_id: i32,
    pub category_id: i32,
    pub amount: Decimal,
    pub description: String,
    pub transaction_type: TransactionType,
}
