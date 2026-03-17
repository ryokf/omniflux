use crate::dto::user_dto::Jwt;
use axum::{
    Json, // 1. Tambahkan import Json dari axum
    extract::FromRequestParts,
    http::{StatusCode, header::AUTHORIZATION, request::Parts},
};
use jsonwebtoken::{DecodingKey, Validation, decode};
use serde_json::json; // 2. Tambahkan import macro json! dari serde_json

impl<S> FromRequestParts<S> for Jwt
where
    S: Send + Sync,
{
    // 3. PERBAIKAN: Ubah Rejection menjadi tuple berisi StatusCode dan Json
    type Rejection = (StatusCode, Json<serde_json::Value>);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // 4. Cek header dan kembalikan pesan error dalam bentuk JSON
        let auth_header = parts
            .headers
            .get(AUTHORIZATION)
            .and_then(|value| value.to_str().ok())
            .ok_or((
                StatusCode::UNAUTHORIZED,
                Json(json!({ "message": "Akses ditolak: Header Authorization tidak ditemukan" })),
            ))?;

        // 5. Cek format Bearer
        if !auth_header.starts_with("Bearer ") {
            return Err((
                StatusCode::UNAUTHORIZED,
                Json(json!({ "message": "Akses ditolak: Format token harus 'Bearer <token>'" })),
            ));
        }

        let token = auth_header.trim_start_matches("Bearer ");
        let secret = "rahasia123";

        // 6. Validasi token dan kembalikan error JSON jika gagal
        let token_data = decode::<Jwt>(
            token,
            &DecodingKey::from_secret(secret.as_ref()),
            &Validation::default(),
        )
        .map_err(|e| {
            eprintln!("JWT Error: {:?}", e);
            (
                StatusCode::UNAUTHORIZED,
                Json(
                    json!({ "message": "Akses ditolak: Token tidak valid atau sudah kedaluwarsa" }),
                ),
            )
        })?;

        Ok(token_data.claims)
    }
}
