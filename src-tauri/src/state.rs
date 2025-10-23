use rusqlite::Connection;
use std::sync::Mutex;

pub struct AppState {
    pub db: Mutex<Connection>,
}

impl AppState {
    pub fn new(db_path: std::path::PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let connection = Connection::open(db_path)?;
        Ok(Self {
            db: Mutex::new(connection),
        })
    }
}
