use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateUserDto {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct UserLoginDto {
    pub email: String,
    pub password: String,
}
