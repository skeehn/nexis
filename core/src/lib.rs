//! # Markify Core
//!
//! The MIT-licensed web data extraction engine for AI agents.
//!
//! ## Quick Start
//!
//! ```no_run
//! use nexis_core::{Markify, ScrapeRequest, OutputFormat};
//!
//! #[tokio::main]
//! async fn main() -> anyhow::Result<()> {
//!     let client = Markify::default();
//!     let result = client.scrape(ScrapeRequest {
//!         url: "https://example.com".to_string(),
//!         formats: vec![OutputFormat::Markdown, OutputFormat::Json],
//!         ..Default::default()
//!     }).await?;
//!     println!("{}", result.markdown.unwrap());
//!     Ok(())
//! }
//! ```

pub mod cache;
pub mod extract;
pub mod fetch;
pub mod scrape;
pub mod transform;
pub mod crawl;
pub mod search;
pub mod telemetry;
pub mod structured_api;
pub mod neural_search;
pub mod cilow;
pub mod vsb_graph;
pub mod index;
pub mod renderless;

pub use scrape::{Markify, ScrapeRequest, ScrapeResult, ScrapeMeta};
pub use extract::{ExtractionMode, ExtractedContent, LinkInfo, ImageInfo, Metadata};
pub use transform::OutputFormat;
pub use cache::CacheConfig;
pub use fetch::FetchConfig;
pub use search::{SearchClient, SearchConfig, SearchResult};
pub use telemetry::Telemetry;
pub use structured_api::{generate_api_spec, execute_api_spec};
pub use structured_api::spec::{ApiSpec, Endpoint, ExecutionResult};
pub use neural_search::ExaClient;
pub use cilow::CilowClient;
pub use vsb_graph::{segment_page, classify_block, VSBGraph};
pub use index::sparse::{SparseIndex, SparseSearchResult};
pub use index::dense::{DenseIndex, DenseSearchResult, DenseVector};
pub use index::hybrid::{HybridSearcher, HybridSearchResult, RrfConfig};

pub use search::query_understanding::{
    understand_query, QueryUnderstandingResult, IntentClassifier, QueryIntent,
    extract_entities, rewrite_query, QueryRewriteResult,
};
pub use search::reranker::{CrossEncoderReranker, CrossEncoderConfig, ReRankedResult, CandidateDocument};

pub use telemetry::otel::{OtelObservability, OtelExporter, TraceContext, TraceMiddleware, MetricsSummary};

pub use structured_api::extraction::{
    ExtractionSchema, SchemaField, FieldType, ExtractionProgram, ExtractionStep,
    ExtractionMethod, PostProcess, LLMExtractionRequest, LLMGeneratedSchema,
    VerificationResult, FieldVerification, PaginationType,
    generate_program, verify_program, execute_program, detect_pagination,
};

/// Library version
pub const VERSION: &str = env!("CARGO_PKG_VERSION");
