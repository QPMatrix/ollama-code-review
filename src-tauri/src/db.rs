use crate::state::AppState;
use tauri::State;

#[tauri::command]
pub fn init_database(state: State<AppState>) -> Result<String, String> {
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
