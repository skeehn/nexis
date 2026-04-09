/**
 * Markify — The MIT-licensed web data layer for AI agents.
 *
 * Scrape, search, extract, and structure web data.
 *
 * @example
 * ```ts
 * import { Markify } from 'markify';
 *
 * const client = new Markify();
 * const result = await client.scrape('https://example.com');
 * console.log(result.markdown);
 * ```
 */

export interface ScrapeOptions {
  /** Extraction mode */
  mode?: "article" | "full" | "links" | "images" | "metadata" | "smart";
  /** Output formats */
  formats?: ("markdown" | "json" | "both")[];
  /** CSS selector to wait for (browser mode) */
  waitForSelector?: string;
  /** Timeout in milliseconds */
  timeoutMs?: number;
  /** Force headless browser rendering */
  forceBrowser?: boolean;
  /** Include raw HTML in response */
  includeRawHtml?: boolean;
  /** Include extracted links */
  includeLinks?: boolean;
}

export interface ScrapeResult {
  url: string;
  success: boolean;
  statusCode: number;
  markdown?: string;
  jsonContent?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  links?: Array<{
    text: string;
    url: string;
    score: number;
    isInternal: boolean;
  }>;
  rawHtml?: string;
  error?: string;
  engine: "http" | "browser";
  fetchMs: number;
  totalMs: number;
  cached: boolean;
}

export interface BatchResult {
  total: number;
  results: Array<{
    url: string;
    success: boolean;
    statusCode?: number;
    markdown?: string;
    metadata?: Record<string, unknown>;
    error?: string;
    fetchMs?: number;
    engine?: string;
  }>;
}

export class Markify {
  private baseUrl: string;
  private timeout: number;

  constructor(options?: { baseUrl?: string; timeout?: number }) {
    this.baseUrl = (options?.baseUrl ?? "http://localhost:3000").replace(/\/+$/, "");
    this.timeout = options?.timeout ?? 30000;
  }

  /** Scrape a single URL */
  async scrape(url: string, options?: ScrapeOptions): Promise<ScrapeResult> {
    const response = await fetch(`${this.baseUrl}/v1/scrape`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        mode: options?.mode ?? "smart",
        formats: options?.formats ?? ["both"],
        wait_for_selector: options?.waitForSelector,
        timeout_ms: options?.timeoutMs,
        force_browser: options?.forceBrowser ?? false,
        include_raw_html: options?.includeRawHtml ?? false,
        include_links: options?.includeLinks ?? false,
      }),
      signal: AbortSignal.timeout(this.timeout),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        url,
        success: false,
        statusCode: 0,
        error: data.error ?? "Unknown error",
        engine: "http",
        fetchMs: 0,
        totalMs: 0,
        cached: false,
      };
    }

    const resultData = data.data ?? {};
    const meta = data.meta ?? {};

    return {
      url,
      success: true,
      statusCode: resultData.status_code ?? 0,
      markdown: resultData.markdown,
      jsonContent: resultData.json_content,
      metadata: resultData.metadata,
      links: resultData.links,
      rawHtml: resultData.raw_html,
      engine: meta.engine ?? "http",
      fetchMs: meta.fetch_ms ?? 0,
      totalMs: meta.total_ms ?? 0,
      cached: meta.cached ?? false,
    };
  }

  /** Scrape multiple URLs in a batch */
  async batch(urls: string[]): Promise<BatchResult> {
    const response = await fetch(`${this.baseUrl}/v1/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
      signal: AbortSignal.timeout(this.timeout),
    });

    return response.json();
  }

  /** Get lightweight metadata for a URL */
  async metadata(url: string): Promise<Record<string, unknown> | null> {
    const response = await fetch(
      `${this.baseUrl}/v1/metadata?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(this.timeout) }
    );

    const data = await response.json();
    return data.success ? data.metadata : null;
  }

  /** Check server health */
  async health(): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/v1/health`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.json();
  }

  // ─── Structured API (Parse.bot-style) ───────────────────────────────

  /** Generate a structured API spec from a URL */
  async generateApi(url: string, description?: string): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/v1/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, description }),
      signal: AbortSignal.timeout(this.timeout),
    });
    return response.json();
  }

  /** List all generated API specs */
  async listApis(): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/v1/apis`, {
      signal: AbortSignal.timeout(this.timeout),
    });
    return response.json();
  }

  /** Get a specific API spec */
  async getApi(id: string): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/v1/apis/${id}`, {
      signal: AbortSignal.timeout(this.timeout),
    });
    return response.json();
  }

  /** Execute a generated API spec */
  async executeApi(id: string, url?: string, params?: Record<string, unknown>): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/v1/apis/${id}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, params }),
      signal: AbortSignal.timeout(this.timeout),
    });
    return response.json();
  }

  // ─── Neural Search (Exa) ────────────────────────────────────────────

  /** Neural/semantic search using Exa AI */
  async neuralSearch(
    query: string,
    numResults: number = 5,
    scrapeResults: boolean = false
  ): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/v1/neural-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, num_results: numResults, scrape_results: scrapeResults }),
      signal: AbortSignal.timeout(this.timeout),
    });
    return response.json();
  }

  // ─── Cilow Export ───────────────────────────────────────────────────

  /** Scrape a URL and export to Cilow's context engine */
  async exportCilow(url: string, tags?: string[], mode: string = "smart"): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/v1/export/cilow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, tags, mode }),
      signal: AbortSignal.timeout(this.timeout),
    });
    return response.json();
  }

  // ─── VSB-Graph (Asterism) ───────────────────────────────────────────

  /** Segment a URL into Visual-Semantic Block Graph */
  async vsb(url: string, format: string = "both", index: boolean = false): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/v1/vsb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, format, index }),
      signal: AbortSignal.timeout(this.timeout),
    });
    return response.json();
  }

  // ─── Sparse Index Search (BM25) ─────────────────────────────────────

  /** Search indexed content using BM25 (Tantivy) */
  async searchIndex(query: string, limit: number = 10): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/v1/search-index?q=${encodeURIComponent(query)}&limit=${limit}`, {
      signal: AbortSignal.timeout(this.timeout),
    });
    return response.json();
  }

  // ─── Dense Index Search (Neural/Cosine) ─────────────────────────────

  /** Search indexed content using dense vectors (cosine similarity) */
  async neuralIndex(query: string, limit: number = 10): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/v1/neural-index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit }),
      signal: AbortSignal.timeout(this.timeout),
    });
    return response.json();
  }
}
