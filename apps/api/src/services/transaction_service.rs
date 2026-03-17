use chrono::Utc;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set,
    TransactionTrait,
};
use uuid::Uuid;

use crate::{
    dto::transaction_dto::{CreateTransactionDto, TransactionType},
    models::{transaction, wallet},
};

pub async fn create_transaction(
    data: CreateTransactionDto,
    user_id: i32,
    db: &DatabaseConnection,
) -> Result<transaction::Model, DbErr> {
    let txn = db.begin().await?;

    let wallet_model = wallet::Entity::find()
        .filter(wallet::Column::Id.eq(data.wallet_id))
        .filter(wallet::Column::UserId.eq(user_id))
        .one(&txn)
        .await?
        .ok_or_else(|| {
            DbErr::Custom("Dompet tidak ditemukan atau bukan milik Anda!".to_string())
        })?;

    let mut current_balance = wallet_model.balance;

    match data.transaction_type {
        TransactionType::Income => {
            current_balance += data.amount;
        }
        TransactionType::Expense => {
            current_balance -= data.amount;
        }
    }

    if current_balance < rust_decimal::Decimal::ZERO {
        return Err(DbErr::Custom("Saldo tidak cukup!".to_string()));
    }

    let mut active_wallet: wallet::ActiveModel = wallet_model.into();
    active_wallet.balance = Set(current_balance);
    active_wallet.update(&txn).await?;

    let transaction_id = Uuid::new_v4().to_string();

    let new_transaction = transaction::ActiveModel {
        id: Set(transaction_id),
        user_id: Set(user_id),
        wallet_id: Set(data.wallet_id),
        category_id: Set(data.category_id),
        amount: Set(data.amount),
        description: Set(data.description),
        ai_confidence: Set(None),
        transaction_date: Set(Some(Utc::now())),
        ..Default::default()
    };

    let saved_transaction = new_transaction.insert(&txn).await?;

    txn.commit().await?;

    Ok(saved_transaction)
}
