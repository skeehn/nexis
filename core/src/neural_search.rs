//! Neural/semantic search using Exa AI API.
//!
//! Exa uses neural embeddings to understand query meaning rather than
//! matching keywords. This provides meaning-based search for AI agents.

use reqwest::Client;
use serde::{Deserialize, Serialize};
use tracing::debug;

/// Exa search result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NeuralSearchResult {
    /// Search query
    pub query: String,
    /// Number of results
    pub count: usize,
    /// Search results
    pub results: Vec<ExaResult>,
}

/// Single Exa result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExaResult {
    /// Page title
    pub title: String,
    /// Page URL
    pub url: String,
    /// Page snippet/summary
    pub text: Option<String>,
    /// Author if available
    pub author: Option<String>,
    /// Published date if available
    pub published_date: Option<String>,
    /// Similarity score
    pub score: Option<f64>,
}

/// Exa search client
pub struct ExaClient {
    client: Client,
    api_key: String,
}

impl ExaClient {
    pub fn new(api_key: String) -> Self {
        Self {
            client: Client::new(),
            api_key,
        }
    }

    /// Create from environment variable
    pub fn from_env() -> Option<Self> {
        std::env::var("EXA_API_KEY")
            .ok()
            .filter(|k| !k.is_empty())
            .map(Self::new)
    }

    /// Neural search — meaning-based, not keyword-based.
    pub async fn search(
        &self,
        query: &str,
        num_results: usize,
    ) -> anyhow::Result<NeuralSearchResult> {
        debug!(query = %query, count = num_results, "Exa neural search");

        #[derive(Serialize)]
        struct ExaRequest {
            query: String,
            #[serde(rename = "numResults")]
            num_results: usize,
            #[serde(rename = "useAutoprompt")]
            use_autoprompt: bool,
            #[serde(skip_serializing_if = "Option::is_none")]
            text: Option<bool>,
        }

        #[derive(Deserialize)]
        struct ExaResponse {
            results: Vec<ExaRawResult>,
        }

        #[derive(Deserialize)]
        struct ExaRawResult {
            title: String,
            url: String,
            #[serde(default)]
            text: Option<String>,
            #[serde(default)]
            author: Option<String>,
            #[serde(default)]
            published_date: Option<String>,
            #[serde(default)]
            score: Option<f64>,
        }

        let response = self
            .client
            .post("https://api.exa.ai/search")
            .header("x-api-key", &self.api_key)
            .header("Content-Type", "application/json")
            .json(&ExaRequest {
                query: query.to_string(),
                num_results,
                use_autoprompt: true,
                text: Some(true),
            })
            .send()
            .await?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            anyhow::bail!("Exa API error: {} - {}", status, body);
        }

        let exa_resp: ExaResponse = response.json().await?;

        let results: Vec<ExaResult> = exa_resp
            .results
            .into_iter()
            .map(|r| ExaResult {
                title: r.title,
                url: r.url,
                text: r.text,
                author: r.author,
                published_date: r.published_date,
                score: r.score,
            })
            .collect();

        debug!(results = results.len(), "Exa search complete");

        Ok(NeuralSearchResult {
            query: query.to_string(),
            count: results.len(),
            results,
        })
    }

    /// Neural search + scrape — search for results then scrape top ones.
    pub async fn search_and_scrape(
        &self,
        query: &str,
        num_results: usize,
        markify: &crate::scrape::Markify,
    ) -> anyhow::Result<Vec<crate::search::SerperScrapeResult>> {
        let search_results = self.search(query, num_results).await?;

        let mut scraped = Vec::new();

        for result in &search_results.results {
            match markify
                .scrape(crate::ScrapeRequest {
                    url: result.url.clone(),
                    formats: vec![crate::OutputFormat::Markdown],
                    mode: crate::ExtractionMode::Article,
                    ..Default::default()
                })
                .await
            {
                Ok((scrape_result, meta)) => {
                    scraped.push(crate::search::SerperScrapeResult {
                        title: result.title.clone(),
                        url: result.url.clone(),
                        snippet: result.text.clone(),
                        markdown: scrape_result.markdown,
                        fetch_ms: meta.fetch_ms,
                        engine: meta.engine,
                    });
                }
                Err(_e) => {
                    scraped.push(crate::search::SerperScrapeResult {
                        title: result.title.clone(),
                        url: result.url.clone(),
                        snippet: result.text.clone(),
                        markdown: None,
                        fetch_ms: 0,
                        engine: "error".to_string(),
                    });
                }
            }
        }

        Ok(scraped)
    }
}

/// Neural search configuration
#[derive(Debug, Clone)]
pub struct NeuralSearchConfig {
    pub api_key: String,
    pub max_results: usize,
}

impl Default for NeuralSearchConfig {
    fn default() -> Self {
        Self {
            api_key: std::env::var("EXA_API_KEY").unwrap_or_default(),
            max_results: 5,
        }
    }
}
