# Tauri Source Code Structure

This document explains the organization of the Tauri backend code.

## Directory Structure

```
src/
├── main.rs                 # Main entry point and application setup
├── lib.rs                  # Library configuration
├── models.rs              # Data structures and models
├── state.rs               # Application state management
├── db.rs                  # Database initialization
└── commands/              # Tauri command handlers
    ├── mod.rs             # Commands module exports
    ├── code_standards.rs  # Code standards CRUD operations
    ├── user_config.rs     # User configuration management
    └── review_history.rs  # Review history operations
```

## Module Overview

### `main.rs`
- **Purpose**: Application entry point
- **Responsibilities**:
  - Plugin initialization (log, http, dialog, fs, shell)
  - Database setup
  - Command handler registration
  - Application lifecycle management

### `models.rs`
- **Purpose**: Data structures used throughout the application
- **Contains**:
  - `CodeStandard`: Code standards data model
  - `UserConfig`: User configuration data model
  - `ReviewHistory`: Review history data model

### `state.rs`
- **Purpose**: Application state management
- **Contains**:
  - `AppState`: Main application state with database connection
  - State initialization logic

### `db.rs`
- **Purpose**: Database initialization
- **Contains**:
  - `init_database`: Command to create database tables
  - Database schema definitions

### `commands/`
Directory containing all Tauri command handlers, organized by domain:

#### `code_standards.rs`
Commands for managing code standards:
- `save_code_standard`: Create a new code standard
- `get_code_standards`: Retrieve all code standards
- `get_code_standard_by_id`: Get a specific code standard
- `update_code_standard`: Update an existing code standard
- `delete_code_standard`: Delete a code standard

#### `user_config.rs`
Commands for user configuration:
- `save_user_config`: Save user settings
- `get_user_config`: Retrieve user configuration

#### `review_history.rs`
Commands for review history:
- `save_review_history`: Save a review result
- `get_review_history`: Retrieve review history with limit

## Adding New Features

### Adding a New Command

1. **Create a new file** in `commands/` (e.g., `new_feature.rs`)
2. **Define your commands** with the `#[tauri::command]` attribute
3. **Import necessary dependencies** from other modules
4. **Export in `commands/mod.rs`**:
   ```rust
   pub mod new_feature;
   pub use new_feature::*;
   ```
5. **Register in `main.rs`**:
   ```rust
   .invoke_handler(tauri::generate_handler![
       // ... existing commands
       commands::your_new_command,
   ])
   ```

### Adding a New Model

1. **Open `models.rs`**
2. **Add your struct** with `#[derive(Debug, Clone, Serialize, Deserialize)]`
3. **Make fields public** with `pub` keyword
4. **Use the model** in your commands

## Database

The application uses SQLite with `rusqlite` for data persistence.

- **Location**: `$APPDATA/ollama_code_reviewer.db`
- **Tables**:
  - `code_standards`
  - `user_config`
  - `review_history`

## Best Practices

1. **Error Handling**: Always use `.map_err(|e| e.to_string())?` for proper error propagation
2. **State Access**: Lock the database mutex early and handle errors appropriately
3. **SQL Queries**: Use parameterized queries to prevent SQL injection
4. **Module Privacy**: Keep implementation details private, expose only what's necessary
5. **Documentation**: Add comments for complex logic

## Development

### Building
```bash
cd src-tauri
cargo build
```

### Type Checking
```bash
cd src-tauri
cargo check
```

### Running
```bash
cd ..
bun tauri dev
```
