use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Contact {
    pub id: i64,
    pub email: String,
    pub firstName: Option<String>,
    pub lastName: Option<String>,
    pub company: Option<String>,
    pub tagsJson: Option<String>,
    pub customJson: Option<String>,
    pub createdAt: Option<String>,
    pub updatedAt: Option<String>,
}