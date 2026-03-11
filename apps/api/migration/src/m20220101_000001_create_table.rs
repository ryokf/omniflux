use sea_orm_migration::{ prelude::*, schema::* };

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 1. Users
        manager.create_table(
            Table::create()
                .table(User::Table)
                .if_not_exists()
                .col(ColumnDef::new(User::Id).integer().not_null().primary_key().auto_increment())
                .col(ColumnDef::new(User::Email).string_len(255).not_null().unique_key())
                .col(ColumnDef::new(User::PasswordHash).string_len(255).not_null())
                .col(ColumnDef::new(User::CreatedAt).timestamp().default(Expr::current_timestamp()))
                .to_owned()
        ).await?;

        // 2. Wallets
        manager.create_table(
            Table::create()
                .table(Wallet::Table)
                .if_not_exists()
                .col(pk_auto(Wallet::Id))
                .col(ColumnDef::new(Wallet::UserId).integer().not_null())
                .col(ColumnDef::new(Wallet::Name).string_len(100).not_null())
                .col(ColumnDef::new(Wallet::Balance).decimal_len(15, 2).not_null().default(0.0))
                .col(
                    ColumnDef::new(Wallet::CreatedAt).timestamp().default(Expr::current_timestamp())
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_wallet_user")
                        .from(Wallet::Table, Wallet::UserId)
                        .to(User::Table, User::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                )
                .to_owned()
        ).await?;

        // 3. Categories
        manager.create_table(
            Table::create()
                .table(Category::Table)
                .if_not_exists()
                .col(pk_auto(Category::Id))
                .col(ColumnDef::new(Category::Name).string_len(50).not_null())
                .col(
                    ColumnDef::new(Category::Type)
                        .enumeration(Alias::new("category_type"), ["income", "expense"])
                        .not_null()
                )
                .to_owned()
        ).await?;

        // 4. Transactions
        manager.create_table(
            Table::create()
                .table(Transaction::Table)
                .if_not_exists()
                .col(ColumnDef::new(Transaction::Id).string_len(36).not_null().primary_key())
                .col(ColumnDef::new(Transaction::UserId).integer().not_null())
                .col(ColumnDef::new(Transaction::WalletId).integer().not_null())
                .col(ColumnDef::new(Transaction::CategoryId).integer().not_null())
                .col(ColumnDef::new(Transaction::Amount).decimal_len(15, 2).not_null())
                .col(ColumnDef::new(Transaction::Description).text().not_null())
                .col(ColumnDef::new(Transaction::AiConfidence).decimal_len(5, 2).null())
                .col(
                    ColumnDef::new(Transaction::TransactionDate)
                        .timestamp()
                        .default(Expr::current_timestamp())
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_transaction_user")
                        .from(Transaction::Table, Transaction::UserId)
                        .to(User::Table, User::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_transaction_wallet")
                        .from(Transaction::Table, Transaction::WalletId)
                        .to(Wallet::Table, Wallet::Id)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_transaction_category")
                        .from(Transaction::Table, Transaction::CategoryId)
                        .to(Category::Table, Category::Id)
                )
                .to_owned()
        ).await?;

        // 5. Assets
        manager.create_table(
            Table::create()
                .table(Asset::Table)
                .if_not_exists()
                .col(pk_auto(Asset::Id))
                .col(ColumnDef::new(Asset::TickerSymbol).string_len(20).not_null().unique_key())
                .col(
                    ColumnDef::new(Asset::AssetType)
                        .enumeration(Alias::new("asset_type"), [
                            "Stock",
                            "Crypto",
                            "Mutual Fund",
                            "Commodity",
                        ])
                        .not_null()
                )
                .col(ColumnDef::new(Asset::Name).string_len(100).not_null())
                .col(ColumnDef::new(Asset::CurrentPrice).decimal_len(15, 2).not_null().default(0.0))
                .col(ColumnDef::new(Asset::Unit).string_len(20).not_null())
                .col(
                    ColumnDef::new(Asset::LastUpdate).timestamp().default(Expr::current_timestamp())
                )
                .to_owned()
        ).await?;

        // 6. Investment Transactions
        manager.create_table(
            Table::create()
                .table(InvestmentTransaction::Table)
                .if_not_exists()
                .col(
                    ColumnDef::new(InvestmentTransaction::Id)
                        .string_len(36)
                        .not_null()
                        .primary_key()
                )
                .col(ColumnDef::new(InvestmentTransaction::UserId).integer().not_null())
                .col(ColumnDef::new(InvestmentTransaction::AssetId).integer().not_null())
                .col(
                    ColumnDef::new(InvestmentTransaction::TransactionType)
                        .enumeration(Alias::new("investment_transaction_type"), ["buy", "sell"])
                        .not_null()
                )
                .col(
                    ColumnDef::new(InvestmentTransaction::TransactionDate)
                        .timestamp()
                        .default(Expr::current_timestamp())
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_investment_transaction_user")
                        .from(InvestmentTransaction::Table, InvestmentTransaction::UserId)
                        .to(User::Table, User::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_investment_transaction_asset")
                        .from(InvestmentTransaction::Table, InvestmentTransaction::AssetId)
                        .to(Asset::Table, Asset::Id)
                )
                .to_owned()
        ).await?;

        // 7. Portfolios
        manager.create_table(
            Table::create()
                .table(Portfolio::Table)
                .if_not_exists()
                .col(pk_auto(Portfolio::Id))
                .col(ColumnDef::new(Portfolio::UserId).integer().not_null())
                .col(ColumnDef::new(Portfolio::AssetId).integer().not_null())
                .col(ColumnDef::new(Portfolio::Quantity).decimal_len(15, 4).not_null().default(0.0))
                .col(
                    ColumnDef::new(Portfolio::PriceAtPurchase)
                        .decimal_len(15, 2)
                        .not_null()
                        .default(0.0)
                )
                .col(
                    ColumnDef::new(Portfolio::UpdatedAt)
                        .timestamp()
                        .default(Expr::current_timestamp())
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_portfolio_user")
                        .from(Portfolio::Table, Portfolio::UserId)
                        .to(User::Table, User::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_portfolio_asset")
                        .from(Portfolio::Table, Portfolio::AssetId)
                        .to(Asset::Table, Asset::Id)
                )
                .to_owned()
        ).await?;

        // 8. Insights
        manager.create_table(
            Table::create()
                .table(Insight::Table)
                .if_not_exists()
                .col(pk_auto(Insight::Id))
                .col(ColumnDef::new(Insight::UserId).integer().not_null())
                .col(ColumnDef::new(Insight::InsightType).string_len(50).not_null())
                .col(ColumnDef::new(Insight::Message).text().not_null())
                .col(ColumnDef::new(Insight::IsRead).boolean().not_null().default(false))
                .col(
                    ColumnDef::new(Insight::CreatedAt)
                        .timestamp()
                        .default(Expr::current_timestamp())
                )
                .foreign_key(
                    ForeignKey::create()
                        .name("fk_insight_user")
                        .from(Insight::Table, Insight::UserId)
                        .to(User::Table, User::Id)
                        .on_delete(ForeignKeyAction::Cascade)
                )
                .to_owned()
        ).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Drop in reverse order to respect foreign key constraints
        manager.drop_table(Table::drop().table(Insight::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Portfolio::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(InvestmentTransaction::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Asset::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Transaction::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Category::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(Wallet::Table).to_owned()).await?;
        manager.drop_table(Table::drop().table(User::Table).to_owned()).await?;

        Ok(())
    }
}

#[derive(DeriveIden)]
enum User {
    Table,
    Id,
    Email,
    PasswordHash,
    CreatedAt,
}

#[derive(DeriveIden)]
enum Wallet {
    Table,
    Id,
    UserId,
    Name,
    Balance,
    CreatedAt,
}

#[derive(DeriveIden)]
enum Category {
    Table,
    Id,
    Name,
    Type,
}

#[derive(DeriveIden)]
enum Transaction {
    Table,
    Id,
    UserId,
    WalletId,
    CategoryId,
    Amount,
    Description,
    AiConfidence,
    TransactionDate,
}

#[derive(DeriveIden)]
enum Asset {
    Table,
    Id,
    TickerSymbol,
    AssetType,
    Name,
    CurrentPrice,
    Unit,
    LastUpdate,
}

#[derive(DeriveIden)]
enum InvestmentTransaction {
    Table,
    Id,
    UserId,
    AssetId,
    TransactionType,
    TransactionDate,
}

#[derive(DeriveIden)]
enum Portfolio {
    Table,
    Id,
    UserId,
    AssetId,
    Quantity,
    PriceAtPurchase,
    UpdatedAt,
}

#[derive(DeriveIden)]
enum Insight {
    Table,
    Id,
    UserId,
    InsightType,
    Message,
    IsRead,
    CreatedAt,
}
