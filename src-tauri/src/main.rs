// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Module declarations
mod commands;
mod db;
mod models;
mod state;

// Import required items
use state::AppState;
use tauri::Manager;

// ============================================================================
// Application Setup
// ============================================================================

fn setup_database(app: &tauri::App) -> Result<AppState, Box<dyn std::error::Error>> {
    // Get the app data directory
    let app_data_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get app data directory");

    // Create the directory if it doesn't exist
    std::fs::create_dir_all(&app_data_dir)?;

    // Create database path
    let db_path = app_data_dir.join("ollama_code_reviewer.db");

    log::info!("Database path: {:?}", db_path);

    // Initialize app state with database connection
    AppState::new(db_path)
}

// ============================================================================
// Main Entry Point
// ============================================================================

fn main() {
    tauri::Builder::default()
        // Initialize plugins
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        // Setup database and state
        .setup(|app| {
            let app_state = setup_database(app).expect("Failed to setup database");
            app.manage(app_state);
            Ok(())
        })
        // Register command handlers
        .invoke_handler(tauri::generate_handler![
            // Database initialization
            db::init_database,
            // Code standards management
            commands::save_code_standard,
            commands::get_code_standards,
            commands::get_code_standard_by_id,
            commands::update_code_standard,
            commands::delete_code_standard,
            // User configuration
            commands::save_user_config,
            commands::get_user_config,
            // Review history
            commands::save_review_history,
            commands::get_review_history,
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
