//! Checkpoint/resume for large crawls.
//!
//! Phase 1 stub.

/// Save crawl state for later resume.
pub fn save_checkpoint(_job_id: &str, _state: &str) {
    // Phase 2: persist to SQLite
}

/// Load crawl state from checkpoint.
pub fn load_checkpoint(_job_id: &str) -> Option<String> {
    // Phase 2: load from SQLite
    None
}
