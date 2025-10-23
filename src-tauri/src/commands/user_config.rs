use crate::models::UserConfig;
use crate::state::AppState;
use rusqlite::OptionalExtension;
use tauri::State;

#[tauri::command]
pub fn save_user_config(state: State<AppState>, config: UserConfig) -> Result<(), String> {
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
pub fn get_user_config(state: State<AppState>) -> Result<Option<UserConfig>, String> {
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
