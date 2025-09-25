use anyhow::Result;
use sqlx::{sqlite::SqliteConnectOptions, SqlitePool};
use std::{path::PathBuf, str::FromStr};
use tokio::fs;
use tauri::Manager;

pub fn db_path(app: &tauri::AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .unwrap_or(std::env::temp_dir())
        .join("velysend.db")
}

pub async fn open_db_at(path: PathBuf) -> Result<SqlitePool> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).await.ok();
    }

    let opts = SqliteConnectOptions::from_str(&format!("sqlite://{}", path.to_string_lossy()))?
        .create_if_missing(true)
        .pragma("journal_mode", "WAL")
        .pragma("synchronous", "NORMAL")
        .pragma("foreign_keys", "ON")
        .pragma("temp_store", "MEMORY");

    let pool = SqlitePool::connect_with(opts).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    Ok(pool)
}
