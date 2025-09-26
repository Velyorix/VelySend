use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Template {
    pub id: i64,
    pub title: String,
    pub description: Option<String>,
    pub subject: Option<String>,
    pub bodyHtml: Option<String>,
    pub attachmentsJson: Option<String>,
    pub variablesJson: Option<String>,
    pub createdAt: String,
    pub updatedAt: String,
}