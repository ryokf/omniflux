use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateWalletDto {
    pub name: String,
    pub user_id: i32,
}
