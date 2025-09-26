use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Account {
    pub id: i64,
    pub label: String,
    pub fromName: Option<String>,
    pub fromEmail: String,
    pub host: String,
    pub port: i64,
    pub security: String,
    pub username: Option<String>,
    pub passwordEnc: Option<String>,
    pub signatureHtml: Option<String>,
    pub rateLimitPerMin: i64,
    pub createdAt: String,
    pub updatedAt: String,
}