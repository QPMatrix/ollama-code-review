# Security

This document outlines the security practices and permissions used in Ollama Code Review.

## Principle of Least Privilege

The application follows the principle of least privilege, requesting only the minimum permissions necessary for its functionality.

## Filesystem Access

### Restricted Scope
The application has **restricted filesystem access** limited to:
- **App Data Directory**: `$APPDATA/com.qpmatrix.ollama-code-review/*`
- **Database File**: `ollama_code_reviewer.db`

**What this means**:
- ✅ The app can read/write its own configuration and database
- ❌ The app **cannot** access other applications' data
- ❌ The app **cannot** access user documents, downloads, or other directories
- ❌ The app **cannot** traverse the entire `$APPDATA` directory

**Platform-specific locations**:
- **macOS**: `~/Library/Application Support/com.qpmatrix.ollama-code-review/`
- **Linux**: `~/.local/share/com.qpmatrix.ollama-code-review/`
- **Windows**: `%APPDATA%\com.qpmatrix.ollama-code-review\`

## Network Access

### HTTP Scope
Network requests are restricted to:
1. **Ollama API**: `http://localhost:11434/*`
   - Purpose: Code review using local AI models
   - Why local: All AI processing stays on your machine

2. **GitHub API**: `https://api.github.com/*`
   - Purpose: Repository and organization management
   - Authentication: Personal Access Token (stored locally)

**What this means**:
- ✅ The app can communicate with local Ollama
- ✅ The app can fetch GitHub data (when authenticated)
- ❌ The app **cannot** send data to arbitrary servers
- ❌ The app **cannot** exfiltrate your code to external services

## Data Storage

### SQLite Database
All data is stored locally in `ollama_code_reviewer.db`:
- **Code Standards**: Your custom coding rules
- **User Config**: GitHub token (encrypted by OS keychain if available), Ollama URL, preferences
- **Review History**: Past code review results

**Privacy**:
- ✅ All data stays on your machine
- ✅ No telemetry or analytics
- ✅ No data sent to external servers
- ❌ Your code is **never** uploaded anywhere except to Ollama (running locally)

## Shell Access

### Limited Scope
The app can:
- ✅ Open files/URLs using the system default application
- ❌ **Cannot** execute arbitrary shell commands
- ❌ **Cannot** modify system files

## User Input Validation

### Zod Schemas
All data is validated using Zod schemas before:
- Database storage
- API requests
- State updates

This prevents:
- SQL injection
- Type confusion attacks
- Malformed data corruption

## GitHub Token Security

### Token Storage
- Tokens are stored in the local database
- Tokens are only sent to `api.github.com`
- Tokens can be cleared via logout

### Best Practices
1. Use **fine-grained tokens** with minimal scopes
2. Set token expiration dates
3. Revoke tokens when no longer needed
4. Never share your tokens

**Required GitHub Scopes**:
- `repo` - Read repository information
- `read:org` - Read organization membership

## Ollama Security

### Local-First AI
- All code review happens locally via Ollama
- No code is sent to external AI services
- You control which models are used

### Recommended Setup
1. Run Ollama on `localhost` only
2. Don't expose Ollama to the network
3. Use trusted models from official sources

## Tauri Security

### Built-in Protections
- **Process Isolation**: Frontend runs in isolated webview
- **IPC Validation**: All commands validated
- **CSP**: Content Security Policy prevents XSS
- **Capability System**: Fine-grained permission control

### Configuration
See [src-tauri/capabilities/default.json](src-tauri/capabilities/default.json) for the complete capability definition.

## Reporting Security Issues

If you discover a security vulnerability, please:
1. **DO NOT** open a public issue
2. Email security details to [your-email@example.com]
3. Allow 90 days for a fix before public disclosure

## Security Checklist

Before using the app:
- [ ] Verify Ollama is running locally only
- [ ] Use fine-grained GitHub tokens
- [ ] Review filesystem permissions
- [ ] Understand what data is stored locally
- [ ] Keep the application updated

## Audit Trail

The application logs all operations to help you understand what it's doing:
- Database operations
- API calls
- File access
- Errors

Logs are available in the development console (DevTools).

## Updates

Security updates are released as:
- **Critical**: Immediate patch release
- **High**: Patch within 7 days
- **Medium**: Patch within 30 days
- **Low**: Included in next feature release

## Dependencies

All dependencies are:
- Scanned for known vulnerabilities
- Updated regularly
- Reviewed for security issues

### Key Dependencies
- **Tauri**: Cross-platform security model
- **Rust**: Memory-safe backend
- **SQLite**: Battle-tested database
- **Zod**: Runtime type validation

## Compliance

The application:
- ✅ Stores data locally (GDPR compliant)
- ✅ No telemetry (privacy-first)
- ✅ Open source (auditable)
- ✅ Minimal permissions (least privilege)

## Future Enhancements

Planned security improvements:
- [ ] OS keychain integration for tokens
- [ ] Database encryption at rest
- [ ] Audit log export
- [ ] Permission request justification UI
- [ ] Automatic security updates

---

**Last Updated**: 2025-10-23
**Security Contact**: [Add your contact]
