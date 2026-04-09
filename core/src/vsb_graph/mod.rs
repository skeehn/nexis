//! Visual-Semantic Block Graph (VSB-Graph) — Phase 2 Asterism core.
//!
//! Replaces flat Markdown with layout-aware, versioned content blocks.
//! Each block has stable IDs across page updates, provenance tracking,
//! and semantic classification.
//!
//! Based on VIPS-inspired segmentation fusing DOM structure, CSS layout
//! cues, and densitometric signals for stable block boundaries.

pub mod types;
pub mod segmenter;
pub mod classifier;
pub mod emitter;
pub mod ml_classifier;

pub use types::*;
pub use segmenter::segment_page;
pub use classifier::classify_block;
pub use emitter::emit_blocks;
pub use ml_classifier::{MLBlockClassifier, MLClassificationResult, ClassificationMode, BlockFeatures};
