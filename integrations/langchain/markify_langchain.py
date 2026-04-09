"""Markify LangChain Integration.

Provides:
- MarkifyLoader: Document Loader for LangChain
- MarkifyTool: LangChain Tool for AI agents

Install:
    pip install langchain langchain-community httpx

Usage:
    from markify.langchain import MarkifyLoader, MarkifyTool

    # Document Loader
    loader = MarkifyLoader(
        urls=["https://en.wikipedia.org/wiki/Web_scraping"],
        api_url="http://localhost:8080",
        mode="article",
    )
    docs = loader.load()
    for doc in docs:
        print(doc.page_content[:200])
        print(doc.metadata)

    # Tool (for LangChain agents)
    tool = MarkifyTool(api_url="http://localhost:8080")
    result = tool.invoke({"url": "https://example.com", "mode": "smart"})
    print(result)
"""

from __future__ import annotations

import json
from typing import Any, List, Optional, Sequence

try:
    import httpx
    from langchain_core.documents import Document
    from langchain_core.tools import BaseTool
except ImportError as e:
    raise ImportError(
        "langchain-core and httpx are required for LangChain integration. "
        "Run: pip install langchain-core httpx"
    ) from e


class MarkifyLoader:
    """LangChain Document Loader for Markify.

    Scrapes URLs and returns clean Markdown as LangChain Documents.
    """

    def __init__(
        self,
        urls: List[str] | str,
        api_url: str = "http://localhost:8080",
        mode: str = "smart",
        include_links: bool = False,
        timeout: float = 30.0,
    ):
        self.urls = [urls] if isinstance(urls, str) else urls
        self.api_url = api_url.rstrip("/")
        self.mode = mode
        self.include_links = include_links
        self.timeout = timeout

    def load(self) -> List[Document]:
        """Load URLs as LangChain Documents."""
        docs = []

        with httpx.Client(base_url=self.api_url, timeout=self.timeout) as client:
            for url in self.urls:
                resp = client.post(
                    "/v1/scrape",
                    json={
                        "url": url,
                        "mode": self.mode,
                        "formats": ["markdown"],
                        "include_links": self.include_links,
                    },
                )
                resp.raise_for_status()
                data = resp.json()

                if not data.get("success"):
                    raise RuntimeError(f"Failed to scrape {url}: {data.get('error')}")

                result_data = data.get("data", {})
                meta = data.get("meta", {})

                content = result_data.get("markdown", "") or ""
                metadata = {
                    "source": url,
                    "title": (result_data.get("metadata") or {}).get("title"),
                    "language": (result_data.get("metadata") or {}).get("language"),
                    "engine": meta.get("engine", "http"),
                    "fetch_ms": meta.get("fetch_ms", 0),
                    "total_ms": meta.get("total_ms", 0),
                }

                if self.include_links and result_data.get("links"):
                    metadata["links"] = result_data["links"]

                docs.append(Document(page_content=content, metadata=metadata))

        return docs

    async def aload(self) -> List[Document]:
        """Async load URLs as LangChain Documents."""
        docs = []

        async with httpx.AsyncClient(
            base_url=self.api_url, timeout=self.timeout
        ) as client:
            for url in self.urls:
                resp = await client.post(
                    "/v1/scrape",
                    json={
                        "url": url,
                        "mode": self.mode,
                        "formats": ["markdown"],
                        "include_links": self.include_links,
                    },
                )
                resp.raise_for_status()
                data = resp.json()

                if not data.get("success"):
                    raise RuntimeError(f"Failed to scrape {url}: {data.get('error')}")

                result_data = data.get("data", {})
                meta = data.get("meta", {})

                content = result_data.get("markdown", "") or ""
                metadata = {
                    "source": url,
                    "title": (result_data.get("metadata") or {}).get("title"),
                    "language": (result_data.get("metadata") or {}).get("language"),
                    "engine": meta.get("engine", "http"),
                    "fetch_ms": meta.get("fetch_ms", 0),
                    "total_ms": meta.get("total_ms", 0),
                }

                docs.append(Document(page_content=content, metadata=metadata))

        return docs


class MarkifyTool(BaseTool):
    """LangChain Tool for Markify.

    Use in LangChain agents to give them web scraping capability.
    """

    name: str = "markify_scrape"
    description: str = (
        "Scrape a URL and return clean Markdown content. "
        "Use this to read web pages. Modes: smart (auto), article (main content), "
        "full (entire page), links (all links), metadata (OG tags only)."
    )
    api_url: str = "http://localhost:8080"
    timeout: float = 30.0

    def _run(self, url: str, mode: str = "smart") -> str:
        """Scrape a URL and return Markdown."""
        with httpx.Client(base_url=self.api_url, timeout=self.timeout) as client:
            resp = client.post(
                "/v1/scrape",
                json={"url": url, "mode": mode, "formats": ["markdown"]},
            )
            resp.raise_for_status()
            data = resp.json()

            if not data.get("success"):
                return f"Error scraping {url}: {data.get('error')}"

            result_data = data.get("data", {})
            meta = data.get("meta", {})
            content = result_data.get("markdown", "") or ""

            return f"# {url} (engine: {meta.get('engine')}, {meta.get('total_ms')}ms)\n\n{content}"

    async def _arun(self, url: str, mode: str = "smart") -> str:
        """Async scrape."""
        async with httpx.AsyncClient(
            base_url=self.api_url, timeout=self.timeout
        ) as client:
            resp = await client.post(
                "/v1/scrape",
                json={"url": url, "mode": mode, "formats": ["markdown"]},
            )
            resp.raise_for_status()
            data = resp.json()

            if not data.get("success"):
                return f"Error scraping {url}: {data.get('error')}"

            result_data = data.get("data", {})
            meta = data.get("meta", {})
            content = result_data.get("markdown", "") or ""

            return f"# {url} (engine: {meta.get('engine')}, {meta.get('total_ms')}ms)\n\n{content}"
