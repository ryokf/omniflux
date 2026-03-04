use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateUserDto {
    pub email: String,
    pub password_hash: String,
}
