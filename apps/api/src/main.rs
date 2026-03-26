#![allow(dead_code)]
use api::{
    config, routes, services,
    utils::{
        category_seeder::category_seeder, crypto_seeder::crypto_seeder, gold_seeder::gold_seeder,
        idx_stock_seeder::idx_stock_seeder, usd_seeder::usd_seeder, user_seeder::user_seeder,
    },
};
use dotenvy::dotenv;
use tokio_cron_scheduler::{Job, JobScheduler};

#[tokio::main]
async fn main() {
    dotenv().ok();

    if let Err(e) = idx_stock_seeder().await {
        eprintln!("Gagal melakukan seeding saham: {}", e);
    }

    if let Err(e) = crypto_seeder().await {
        eprintln!("Gagal melakukan seeding kripto: {}", e);
    }

    if let Err(e) = gold_seeder().await {
        eprintln!("Gagal melakukan seeding emas: {}", e);
    }

    if let Err(e) = usd_seeder().await {
        eprintln!("Gagal melakukan seeding usd: {}", e);
    }

    if let Err(e) = user_seeder().await {
        eprintln!("Gagal melakukan seeding user default: {}", e);
    }

    if let Err(e) = category_seeder().await {
        eprintln!("Gagal melakukan seeding category default: {}", e);
    }

    let app_state = config::db::db_state().await;

    // Set up scheduler
    let sched = JobScheduler::new().await.unwrap();
    let db_for_cron = app_state.db.clone();

    sched
        .add(
            Job::new_async("0 * * * * *", move |_uuid, mut _l| {
                let db = db_for_cron.clone();
                Box::pin(async move {
                    if let Err(e) = services::insight_service::run_analytic_assistant(&db).await {
                        eprintln!("Error running analytic assistant: {}", e);
                    } else {
                        println!("Analytic assistant completed execution.");
                    }
                })
            })
            .unwrap(),
        )
        .await
        .unwrap();

    sched.start().await.unwrap();

    let app = routes::create_router(app_state).await;
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000").await.unwrap();

    println!("server running on http://localhost:4000");
    axum::serve(listener, app).await.unwrap();
}
