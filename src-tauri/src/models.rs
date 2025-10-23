use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeStandard {
    pub id: Option<i64>,
    pub name: String,
    pub framework: String,
    pub language: String,
    pub rules: String,
    pub best_practices: String,
    pub created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserConfig {
    pub id: Option<i64>,
    pub github_username: Option<String>,
    pub github_token: Option<String>,
    pub ollama_url: String,
    pub selected_model: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ReviewHistory {
    pub id: i64,
    pub file_path: String,
    pub framework: String,
    pub language: String,
    pub review_result: String,
    pub issues_found: i32,
    pub reviewed_at: String,
}
