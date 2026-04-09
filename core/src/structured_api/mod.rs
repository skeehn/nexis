//! Structured API generation from URLs (Parse.bot-style).
//!
//! Given a URL + optional description, generates a structured API spec
//! with typed endpoints, input parameters, and response schemas.
//!
//! Flow:
//! 1. POST /v1/generate → scrape page → analyze structure → generate spec
//! 2. GET /v1/apis → list all generated APIs
//! 3. GET /v1/apis/{id} → get full spec
//! 4. POST /v1/apis/{id}/execute → run extraction
//!
//! Phase 2: Hybrid structured extraction with schema + LLM modes.

pub mod generator;
pub mod executor;
pub mod spec;
pub mod extraction;

pub use generator::generate_api_spec;
pub use executor::execute_api_spec;
pub use spec::*;
