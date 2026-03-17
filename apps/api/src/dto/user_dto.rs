use serde::{Deserialize, Serialize};

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

#[derive(Deserialize, Serialize, Clone)]
pub struct Jwt {
    pub sub: i32,
    pub exp: usize,
}

#[derive(Serialize)]
pub struct AuthResponseDto {
    pub token: String,
}
