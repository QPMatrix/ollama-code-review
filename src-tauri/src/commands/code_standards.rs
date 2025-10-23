use crate::models::CodeStandard;
use crate::state::AppState;
use rusqlite::Result as SqlResult;
use tauri::State;

#[tauri::command]
pub fn save_code_standard(state: State<AppState>, standard: CodeStandard) -> Result<i64, String> {
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
pub fn get_code_standards(state: State<AppState>) -> Result<Vec<CodeStandard>, String> {
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
pub fn get_code_standard_by_id(state: State<AppState>, id: i64) -> Result<CodeStandard, String> {
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
pub fn update_code_standard(
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
pub fn delete_code_standard(state: State<AppState>, id: i64) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    db.execute("DELETE FROM code_standards WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;

    Ok(())
}
