use anyhow::{anyhow, Result};
use chrono::Utc;
use sqlx::{Row, SqlitePool};
use tokio::{task, time::{sleep, Duration}};

#[derive(Clone, Copy)]
pub struct SchedulerConfig {
    pub poll_interval_ms: u64,
    pub idle_backoff_ms: u64,
}

impl Default for SchedulerConfig {
    fn default() -> Self {
        Self { poll_interval_ms: 500, idle_backoff_ms: 800 }
    }
}

pub async fn run_scheduler(pool: SqlitePool, cfg: SchedulerConfig) {
    task::spawn(async move {
        loop {
            match tick(&pool).await {
                Ok(progress) => {
                    if !progress {
                        sleep(Duration::from_millis(cfg.idle_backoff_ms)).await;
                    } else {
                        sleep(Duration::from_millis(cfg.poll_interval_ms)).await;
                    }
                }
                Err(e) => {
                    eprintln!("[scheduler] tick error: {e}");
                    sleep(Duration::from_millis(1500)).await;
                }
            }
        }
    });
}

async fn tick(pool: &SqlitePool) -> Result<bool> {
    let now = Utc::now().to_rfc3339();

    let rec = sqlx::query(
        r#"
        SELECT id, accountId
        FROM email_jobs
        WHERE status IN ('queued','scheduled')
          AND (status='queued' OR (status='scheduled' AND (scheduledAt IS NOT NULL AND scheduledAt <= ?)))
        ORDER BY createdAt ASC
        LIMIT 1
        "#
    )
        .bind(&now)
        .fetch_optional(pool)
        .await?;

    let Some(row) = rec else {
        return Ok(false);
    };

    let job_id: i64 = row.get("id");
    let account_id: i64 = row.get("accountId");

    let per_min: i64 = sqlx::query_scalar::<_, i64>(
        "SELECT rateLimitPerMin FROM accounts WHERE id=?"
    )
        .bind(account_id)
        .fetch_optional(pool)
        .await?
        .unwrap_or(60);

    let gap_ms = (60_000i64 / per_min.max(1)) as u64;
    sleep(Duration::from_millis(gap_ms)).await;

    process_job(pool, job_id).await?;
    Ok(true)
}

async fn process_job(pool: &SqlitePool, job_id: i64) -> Result<()> {
    let start = Utc::now();

    sqlx::query(
        "UPDATE email_jobs SET status='sending', updatedAt=? WHERE id=?"
    )
        .bind(start.to_rfc3339())
        .bind(job_id)
        .execute(pool)
        .await?;

    let _job = sqlx::query(
        r#"
        SELECT ej.id, ej.accountId, ej.subject, ej.bodyHtml, ej.bodyText,
               ej.toJson, ej.ccJson, ej.bccJson, ej.attachmentsJson,
               a.fromName, a.fromEmail, a.host, a.port, a.security,
               a.username, a.passwordEnc
        FROM email_jobs ej
        JOIN accounts a ON a.id = ej.accountId
        WHERE ej.id = ?
        "#
    )
        .bind(job_id)
        .fetch_one(pool)
        .await?;

    // TODO: déchiffrer mdp + envoyer via lettre
    let simulate_success = true;

    let end = Utc::now();
    let duration_ms = (end - start).num_milliseconds();

    if simulate_success {
        sqlx::query(
            "UPDATE email_jobs SET status='sent', sentAt=?, durationMs=?, updatedAt=? WHERE id=?"
        )
            .bind(end.to_rfc3339())
            .bind(duration_ms)
            .bind(end.to_rfc3339())
            .bind(job_id)
            .execute(pool)
            .await?;
    } else {
        let err = anyhow!("SMTP send simulated failure");
        sqlx::query(
            "UPDATE email_jobs SET status='failed', errorMessage=?, updatedAt=? WHERE id=?"
        )
            .bind(err.to_string())
            .bind(end.to_rfc3339())
            .bind(job_id)
            .execute(pool)
            .await?;
    }

    Ok(())
}