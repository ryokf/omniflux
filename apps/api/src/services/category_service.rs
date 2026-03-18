use sea_orm::{DatabaseConnection, DbErr, EntityTrait};
use crate::models::category::{self, Entity as Category, Model};

pub async fn get_categories(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    Category::find().all(db).await
}
