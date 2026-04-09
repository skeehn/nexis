//! Tri-modal Index module (Phase 2).
//!
//! Phase 1: Sparse BM25 index (Tantivy) — ✅
//! Phase 2: Dense vector index (TF-IDF cosine → ML embeddings + HNSW) — ✅
//! Phase 3: Hybrid RRF fusion — ✅
//! Phase 4: Temporal property graph — TODO

pub mod sparse;
pub mod dense;
pub mod hybrid;

pub use sparse::{SparseIndex, SparseSearchResult};
pub use dense::{DenseIndex, DenseSearchResult, DenseVector};
pub use hybrid::{HybridSearcher, HybridSearchResult, RrfConfig, reciprocal_rank_fusion};
