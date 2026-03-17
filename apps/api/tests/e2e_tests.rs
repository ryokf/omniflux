
use reqwest::{Client, StatusCode};
use serde_json::{Value, json};
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::net::TcpListener;

// Assuming we expose the routes from main or we can just import create_router


// The best way to integration test Axum is to spawn it on a background thread.
// Since `main.rs` is a binary, we'll try to import `routes::create_router`.
// If it's exposed as a library.
// Let's create a helper to start the app.

async fn setup_app() -> String {
    let app_state = api::config::db::db_state().await;

    // Seed test categories
    use api::models::{category, sea_orm_active_enums::Type};
    use sea_orm::{ActiveModelTrait, EntityTrait, Set};

    // Check if category 1 exists, if not create
    if category::Entity::find_by_id(1)
        .one(&app_state.db)
        .await
        .unwrap()
        .is_none()
    {
        let cat_income = category::ActiveModel {
            id: Set(1),
            name: Set("Gaji".to_string()),
            r#type: Set(Type::Income),
        };
        cat_income.insert(&app_state.db).await.unwrap();
    }

    if category::Entity::find_by_id(2)
        .one(&app_state.db)
        .await
        .unwrap()
        .is_none()
    {
        let cat_expense = category::ActiveModel {
            id: Set(2),
            name: Set("Makan".to_string()),
            r#type: Set(Type::Expense),
        };
        cat_expense.insert(&app_state.db).await.unwrap();
    }

    let app = api::routes::create_router(app_state).await;

    // We bind to port 0 which lets the OS assign a random free port (or 4001 specifically).
    let listener = TcpListener::bind("127.0.0.1:4001").await.unwrap();
    let addr = listener.local_addr().unwrap();

    // Spawn the server in the background
    tokio::spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });

    format!("http://{}", addr)
}

#[tokio::test]
async fn test_full_e2e_flow() {
    dotenvy::dotenv().ok();

    // 1. Setup Server Background
    let base_url = setup_app().await;
    let client = Client::new();

    // Generate dynamic email
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let email = format!("budi{}@gmail.com", timestamp);
    let password = "password123";

    // Scenario 1: Registrasi Akun
    let register_payload = json!({
        "email": email,
        "password": password
    });

    let res = client
        .post(&format!("{}/api/v1/users/register", base_url))
        .json(&register_payload)
        .send()
        .await
        .expect("Failed to execute request.");

    assert_eq!(res.status(), StatusCode::OK);

    let body: Value = res.json().await.unwrap();
    let user_id = body["data"]["id"].as_i64().expect("Missing user ID");

    // Scenario 2: Login dan Ambil Kunci
    let login_payload = json!({
        "email": email,
        "password": password
    });

    let res = client
        .post(&format!("{}/api/v1/users/login", base_url))
        .json(&login_payload)
        .send()
        .await
        .expect("Failed to execute request.");

    assert_eq!(res.status(), StatusCode::OK);

    let body: Value = res.json().await.unwrap();
    let token = body["data"]["token"]
        .as_str()
        .expect("Missing token")
        .to_string();

    // Scenario 3: Setup Dompet
    let wallet_payload = json!({
        "name": "Dompet E2E",
        "user_id": user_id
    });

    let res = client
        .post(&format!("{}/api/v1/wallets", base_url))
        .header("Authorization", format!("Bearer {}", token))
        .json(&wallet_payload)
        .send()
        .await
        .expect("Failed to execute request.");

    assert_eq!(res.status(), StatusCode::OK);

    let body: Value = res.json().await.unwrap();
    let wallet_id = body["data"]["id"].as_i64().expect("Missing wallet ID");

    // Scenario 4: Pemasukan Uang (Top Up)
    let income_payload = json!({
        "wallet_id": wallet_id,
        "category_id": 1, // Asumsi ada kategori
        "amount": "1000000.00", // Decimal serialization usually expects strings or numbers
        "description": "Gaji E2E",
        "transaction_type": "income"
    });

    let res = client
        .post(&format!("{}/api/v1/transactions", base_url))
        .header("Authorization", format!("Bearer {}", token))
        .json(&income_payload)
        .send()
        .await
        .expect("Failed to execute request.");

    if res.status() != StatusCode::OK {
        let err = res.text().await.unwrap();
        panic!("Income transaction failed: {}", err);
    }

    // Scenario 5: Pengeluaran Uang
    let expense_payload = json!({
        "wallet_id": wallet_id,
        "category_id": 2, // Asumsi ada kategori
        "amount": "50000.00",
        "description": "Makan siang E2E",
        "transaction_type": "expense"
    });

    let res = client
        .post(&format!("{}/api/v1/transactions", base_url))
        .header("Authorization", format!("Bearer {}", token))
        .json(&expense_payload)
        .send()
        .await
        .expect("Failed to execute request.");

    if res.status() != StatusCode::OK {
        let err = res.text().await.unwrap();
        panic!("Expense transaction failed: {}", err);
    }

    // Scenario 6: Validasi Kebenaran Matematika
    // Fetch user wallets to get the balance
    let res = client
        .get(&format!("{}/api/v1/wallets/{}", base_url, user_id))
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .expect("Failed to execute request.");

    assert_eq!(res.status(), StatusCode::OK);

    let body: Value = res.json().await.unwrap();
    // Assuming backend returns a list of wallets or a single wallet for user
    // The endpoint get_wallet_by_user_id returns a list of wallets based on our exploration
    let wallets = body["data"].as_array().expect("Expected array of wallets");

    // Find our specific wallet
    let test_wallet = wallets
        .iter()
        .find(|w| w["id"].as_i64() == Some(wallet_id))
        .expect("Wallet not found in response");

    let balance_str = test_wallet["balance"].as_str().expect("Missing balance");
    let balance: f64 = balance_str.parse().expect("Failed to parse balance");

    // Puncak Pengujian: Saldo HARUS bernilai tepat 950 Ribu.
    assert_eq!(
        balance, 950000.0,
        "SALDO TIDAK SESUAI! HARUS 950000, TAPI DAPAT {}",
        balance
    );
}
