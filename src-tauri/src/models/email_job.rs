use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct EmailJob {
    pub id: i64,
    pub accountId: i64,
    pub subject: Option<String>,
    pub bodyHtml: Option<String>,
    pub bodyText: Option<String>,
    pub toJson: Option<String>,
    pub ccJson: Option<String>,
    pub bccJson: Option<String>,
    pub attachmentsJson: Option<String>,
    pub status: String,
    pub errorMessage: Option<String>,
    pub scheduledAt: Option<String>,
    pub sentAt: Option<String>,
    pub durationMs: Option<i64>,
    pub smtpMetaJson: Option<String>,
    pub templateId: Option<i64>,
    pub variablesJson: Option<String>,
    pub createdAt: String,
    pub updatedAt: String,
}