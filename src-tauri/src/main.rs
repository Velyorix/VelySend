mod utils;
mod services;

use utils::{db, seeds};
use services::scheduler::{run_scheduler, SchedulerConfig};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            let db_path = db::db_path(&app_handle);

            tauri::async_runtime::spawn(async move {
                match db::open_db_at(db_path).await {
                    Ok(pool) => {
                        if let Err(e) = seeds::seed_if_needed(&pool).await {
                            eprintln!("[init] seed error: {e}");
                        }
                        run_scheduler(pool, SchedulerConfig::default()).await;
                    }
                    Err(e) => eprintln!("[init] db open error: {e}"),
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
