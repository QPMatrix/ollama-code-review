// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{Connection, OptionalExtension, Result as SqlResult};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{Manager, State};

// ============================================================================
// Data Models
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CodeStandard {
    id: Option<i64>,
    name: String,
    framework: String,
    language: String,
    rules: String,
    best_practices: String,
    created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct UserConfig {
    id: Option<i64>,
    github_username: Option<String>,
    github_token: Option<String>,
    ollama_url: String,
    selected_model: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ReviewHistory {
    id: i64,
    file_path: String,
    framework: String,
    language: String,
    review_result: String,
    issues_found: i32,
    reviewed_at: String,
}

// ============================================================================
// Application State
// ============================================================================

struct AppState {
    db: Mutex<Connection>,
}

impl AppState {
    fn new(db_path: std::path::PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let connection = Connection::open(db_path)?;
        Ok(Self {
            db: Mutex::new(connection),
        })
    }
}

// ============================================================================
// Database Commands
// ============================================================================

#[tauri::command]
fn init_database(state: State<AppState>) -> Result<String, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    // Create code_standards table
    db.execute(
        "CREATE TABLE IF NOT EXISTS code_standards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            framework TEXT NOT NULL,
            language TEXT NOT NULL,
            rules TEXT NOT NULL,
            best_practices TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )
    .map_err(|e| e.to_string())?;

    // Create user_config table
    db.execute(
        "CREATE TABLE IF NOT EXISTS user_config (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            github_username TEXT,
            github_token TEXT,
            ollama_url TEXT NOT NULL DEFAULT 'http://localhost:11434',
            selected_model TEXT
        )",
        [],
    )
    .map_err(|e| e.to_string())?;

    // Create review_history table
    db.execute(
        "CREATE TABLE IF NOT EXISTS review_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_path TEXT NOT NULL,
            framework TEXT NOT NULL,
            language TEXT NOT NULL,
            review_result TEXT NOT NULL,
            issues_found INTEGER DEFAULT 0,
            reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )
    .map_err(|e| e.to_string())?;

    Ok("Database initialized successfully".to_string())
}

// ============================================================================
// Code Standards Commands
// ============================================================================

#[tauri::command]
fn save_code_standard(state: State<AppState>, standard: CodeStandard) -> Result<i64, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    db.execute(
        "INSERT INTO code_standards (name, framework, language, rules, best_practices)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        [
            &standard.name,
            &standard.framework,
            &standard.language,
            &standard.rules,
            &standard.best_practices,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(db.last_insert_rowid())
}

#[tauri::command]
fn get_code_standards(state: State<AppState>) -> Result<Vec<CodeStandard>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare(
            "SELECT id, name, framework, language, rules, best_practices, created_at
             FROM code_standards
             ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let standards = stmt
        .query_map([], |row| {
            Ok(CodeStandard {
                id: row.get(0)?,
                name: row.get(1)?,
                framework: row.get(2)?,
                language: row.get(3)?,
                rules: row.get(4)?,
                best_practices: row.get(5)?,
                created_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    Ok(standards)
}

#[tauri::command]
fn get_code_standard_by_id(state: State<AppState>, id: i64) -> Result<CodeStandard, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare(
            "SELECT id, name, framework, language, rules, best_practices, created_at
             FROM code_standards
             WHERE id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let standard = stmt
        .query_row([id], |row| {
            Ok(CodeStandard {
                id: row.get(0)?,
                name: row.get(1)?,
                framework: row.get(2)?,
                language: row.get(3)?,
                rules: row.get(4)?,
                best_practices: row.get(5)?,
                created_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(standard)
}

#[tauri::command]
fn update_code_standard(
    state: State<AppState>,
    id: i64,
    standard: CodeStandard,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    db.execute(
        "UPDATE code_standards
         SET name = ?1, framework = ?2, language = ?3, rules = ?4, best_practices = ?5
         WHERE id = ?6",
        [
            &standard.name,
            &standard.framework,
            &standard.language,
            &standard.rules,
            &standard.best_practices,
            &id.to_string(),
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn delete_code_standard(state: State<AppState>, id: i64) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    db.execute("DELETE FROM code_standards WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

// ============================================================================
// User Configuration Commands
// ============================================================================

#[tauri::command]
fn save_user_config(state: State<AppState>, config: UserConfig) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    // Clear existing config (single row table)
    db.execute("DELETE FROM user_config", [])
        .map_err(|e| e.to_string())?;

    // Insert new config
    db.execute(
        "INSERT INTO user_config (github_username, github_token, ollama_url, selected_model)
         VALUES (?1, ?2, ?3, ?4)",
        [
            &config.github_username.unwrap_or_default(),
            &config.github_token.unwrap_or_default(),
            &config.ollama_url,
            &config.selected_model.unwrap_or_default(),
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn get_user_config(state: State<AppState>) -> Result<Option<UserConfig>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare(
            "SELECT id, github_username, github_token, ollama_url, selected_model
             FROM user_config
             LIMIT 1",
        )
        .map_err(|e| e.to_string())?;

    let config = stmt
        .query_row([], |row| {
            Ok(UserConfig {
                id: row.get(0)?,
                github_username: row.get(1)?,
                github_token: row.get(2)?,
                ollama_url: row.get(3)?,
                selected_model: row.get(4)?,
            })
        })
        .optional()
        .map_err(|e| e.to_string())?;

    Ok(config)
}

// ============================================================================
// Review History Commands
// ============================================================================

#[tauri::command]
fn save_review_history(
    state: State<AppState>,
    file_path: String,
    framework: String,
    language: String,
    review_result: String,
    issues_found: i32,
) -> Result<i64, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    db.execute(
        "INSERT INTO review_history (file_path, framework, language, review_result, issues_found)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        [
            &file_path,
            &framework,
            &language,
            &review_result,
            &issues_found.to_string(),
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(db.last_insert_rowid())
}

#[tauri::command]
fn get_review_history(state: State<AppState>, limit: i32) -> Result<Vec<ReviewHistory>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare(
            "SELECT id, file_path, framework, language, review_result, issues_found, reviewed_at
             FROM review_history
             ORDER BY reviewed_at DESC
             LIMIT ?1",
        )
        .map_err(|e| e.to_string())?;

    let history = stmt
        .query_map([limit], |row| {
            Ok(ReviewHistory {
                id: row.get(0)?,
                file_path: row.get(1)?,
                framework: row.get(2)?,
                language: row.get(3)?,
                review_result: row.get(4)?,
                issues_found: row.get(5)?,
                reviewed_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    Ok(history)
}

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
            init_database,
            // Code standards management
            save_code_standard,
            get_code_standards,
            get_code_standard_by_id,
            update_code_standard,
            delete_code_standard,
            // User configuration
            save_user_config,
            get_user_config,
            // Review history
            save_review_history,
            get_review_history,
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
