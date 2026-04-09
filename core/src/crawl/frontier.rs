//! URL Frontier: priority queue for crawl URLs.
//!
//! Phase 1 stub — full implementation in Phase 2.

/// Priority queue for managing crawl URLs.
pub struct UrlFrontier {
    // Future: priority queue sorted by relevance, domain politeness, freshness
}

impl UrlFrontier {
    pub fn new() -> Self {
        Self {}
    }

    /// Add a URL to the frontier.
    pub fn push(&mut self, _url: &str, _priority: f64) {
        // Phase 2: implement priority queue
    }

    /// Get the next URL to crawl.
    pub fn pop(&mut self) -> Option<String> {
        // Phase 2: return highest priority URL
        None
    }

    /// Number of URLs in the frontier.
    pub fn len(&self) -> usize {
        0
    }

    pub fn is_empty(&self) -> bool {
        true
    }
}

impl Default for UrlFrontier {
    fn default() -> Self {
        Self::new()
    }
}
