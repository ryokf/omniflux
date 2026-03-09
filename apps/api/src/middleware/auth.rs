use axum::{ extract::FromRequestParts, http::{ request::Parts, StatusCode } };
use jsonwebtoken::{ decode, DecodingKey, Validation };
use crate::dto::user_dto::Jwt;

impl<S> FromRequestParts<S> for Jwt where S: Send + Sync {
    // KITA SEDERHANAKAN: Langsung gunakan StatusCode jika gagal, tidak perlu buat enum error
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // 1. Coba ambil tulisan di header "Authorization"
        let auth_header = parts.headers
            .get("Authorization")
            .and_then(|value| value.to_str().ok())
            .ok_or(StatusCode::UNAUTHORIZED)?; // Jika header tidak ada, langsung tolak (401)

        // 2. Cek apakah awalan teksnya adalah "Bearer "
        if !auth_header.starts_with("Bearer ") {
            return Err(StatusCode::UNAUTHORIZED);
        }

        // 3. Buang kata "Bearer " untuk mengambil kode tokennya saja
        let token = auth_header.trim_start_matches("Bearer ");

        // 4. Siapkan kunci rahasia (HARUS SAMA dengan yang di fitur login)
        let secret = "KUNCI_RAHASIA_SUPER_AMAN";

        // 5. Coba bongkar (decode) tokennya
        let token_data = decode::<Jwt>(
            token,
            &DecodingKey::from_secret(secret.as_ref()),
            &Validation::default()
        ).map_err(|_| StatusCode::UNAUTHORIZED)?; // Jika token palsu atau kedaluwarsa, tolak (401)

        // 6. Berhasil! Kembalikan data Jwt (berisi ID user) ke controller
        Ok(token_data.claims)
    }
}
