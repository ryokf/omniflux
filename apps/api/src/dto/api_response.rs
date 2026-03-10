use serde::Serialize;

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub status: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
}

impl<T> ApiResponse<T> {
    pub fn success(message: &str, data: T) -> Self {
        Self {
            status: "success".to_string(),
            message: message.to_string(),
            data: Some(data),
        }
    }

    pub fn success_without_data(message: &str) -> Self {
        Self {
            status: "success".to_string(),
            message: message.to_string(),
            data: None,
        }
    }

    pub fn error(message: &str) -> Self {
        Self {
            status: "error".to_string(),
            message: message.to_string(),
            data: None,
        }
    }
}
