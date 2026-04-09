//! Robots.txt parser and politeness controller.
//!
//! Phase 1 stub — uses robotstxt crate in Phase 2.

/// Check if a URL is allowed by robots.txt.
pub fn is_allowed(_robots_txt: &str, _url: &str) -> bool {
    // Phase 2: use robotstxt crate
    true
}

/// Parse crawl delay from robots.txt.
pub fn get_crawl_delay(_robots_txt: &str) -> Option<std::time::Duration> {
    // Phase 2: extract Crawl-delay directive
    None
}
