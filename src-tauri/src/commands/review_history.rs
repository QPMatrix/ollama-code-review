use crate::models::ReviewHistory;
use crate::state::AppState;
use rusqlite::Result as SqlResult;
use tauri::State;

#[tauri::command]
pub fn save_review_history(
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
pub fn get_review_history(state: State<AppState>, limit: i32) -> Result<Vec<ReviewHistory>, String> {
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
