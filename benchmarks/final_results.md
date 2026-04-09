# Markify Benchmark Report

Generated: 2026-04-08 23:26:44 UTC

## URL Scraping Performance

| URL | Markify (ms) | Firecrawl (ms) | Jina (ms) | Markify Content |
|-----|-------------|---------------|-----------|----------------|
| https://example.com | **56.2** (http) | 525.4 | 675.2 | 111 chars |
| https://en.wikipedia.org/wiki/Web_scraping | **325.7** (http) | 820.9 | 4472.5 | 25,697 chars |
| https://httpbin.org/html | **18.6** (http) | 438.0 | 1502.4 | 3,632 chars |
| https://news.ycombinator.com | **419.4** (http) | 509.9 | 699.3 | 3,836 chars |
| https://github.com | **598.3** (http) | 450.2 | 837.3 | 1,774 chars |

### Markify Summary

- **Average latency**: 284ms
- **Min latency**: 19ms
- **Max latency**: 598ms
- **Success rate**: 5/5

- **vs Firecrawl**: faster (1.9x)
- **vs Jina**: faster (5.8x)

## Web Search Performance

| Query | Markify (ms) | Results | Status |
|-------|-------------|---------|--------|
| Rust web scraping framework | **877.4** | 5 | OK |
| best AI agent tools 2026 | **814.8** | 5 | OK |
| Model Context Protocol MCP | **541.8** | 5 | OK |

---
*Benchmarked with Markify 0.1.0 (Rust/Axum)*