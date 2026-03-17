use chrono::{Datelike, Utc};
use rust_decimal::prelude::Zero;
use rust_decimal::{Decimal, prelude::FromPrimitive};
use sea_orm::*;
use std::error::Error;

use crate::models::{insight, transaction, user};

pub async fn get_unread_insights(
    db: &DatabaseConnection,
    user_id: i32,
) -> Result<Vec<insight::Model>, Box<dyn Error + Send + Sync>> {
    let unread_insights = insight::Entity::find()
        .filter(insight::Column::UserId.eq(user_id))
        .filter(insight::Column::IsRead.eq(0)) // 0 represents false
        .all(db)
        .await?;

    Ok(unread_insights)
}

pub async fn mark_insight_as_read(
    db: &DatabaseConnection,
    insight_id: i32,
    user_id: i32,
) -> Result<insight::Model, Box<dyn Error + Send + Sync>> {
    let insight_to_update = insight::Entity::find()
        .filter(insight::Column::Id.eq(insight_id))
        .filter(insight::Column::UserId.eq(user_id))
        .one(db)
        .await?
        .ok_or("Insight not found")?;

    let mut insight_active: insight::ActiveModel = insight_to_update.into();
    insight_active.is_read = Set(1); // 1 represents true

    let updated_insight = insight_active.update(db).await?;

    Ok(updated_insight)
}

pub async fn run_analytic_assistant(
    db: &DatabaseConnection,
) -> Result<(), Box<dyn Error + Send + Sync>> {
    let users = user::Entity::find().all(db).await?;
    let budget_limit = Decimal::from_i32(3_000_000).unwrap();
    let threshold = budget_limit * Decimal::from_f32(0.8).unwrap();

    let now = Utc::now();
    let current_year = now.year();
    let current_month = now.month();
    let today_start = now.date_naive().and_hms_opt(0, 0, 0).unwrap().and_utc();

    for user in users {
        // Find transactions for this user in the current month
        // We'll approximate by finding transactions greater than the start of the month
        // Or we can just calculate total amount and let SeaOrm handle it if it supports it,
        // but Since transaction_date is Option<DateTimeUtc>, we'll filter in Rust if needed, or using database.

        let condition = Condition::all().add(transaction::Column::UserId.eq(user.id));

        let user_txs = transaction::Entity::find()
            .filter(condition)
            .all(db)
            .await?;

        let mut total_expense = Decimal::zero();

        for tx in user_txs {
            if let Some(date) = tx.transaction_date {
                if date.year() == current_year && date.month() == current_month {
                    total_expense += tx.amount;
                }
            }
        }

        if total_expense > threshold {
            // Check if warning was already sent today
            let already_warned = insight::Entity::find()
                .filter(insight::Column::UserId.eq(user.id))
                .filter(insight::Column::InsightType.eq("Budget Warning"))
                .filter(insight::Column::CreatedAt.gte(today_start))
                .one(db)
                .await?;

            if already_warned.is_none() {
                // Create new insight
                let new_insight = insight::ActiveModel {
                    user_id: Set(user.id),
                    insight_type: Set("Budget Warning".to_string()),
                    message: Set("Awas, pengeluaran Anda sudah mencapai 80% anggaran!".to_string()),
                    is_read: Set(0),
                    created_at: Set(Some(Utc::now())),
                    ..Default::default()
                };

                new_insight.insert(db).await?;
            }
        }
    }

    Ok(())
}
