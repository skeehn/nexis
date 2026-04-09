import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Copy,
  Download,
  Globe,
  Trash2,
  Zap,
  Check,
  Loader2,
  Code,
  Link2,
  FileText,
  Braces,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const EXTRACTION_MODES = [
  { value: 'smart', label: 'Smart', icon: Zap, description: 'Auto-detect content type' },
  { value: 'article', label: 'Article', icon: FileText, description: 'Extract main article only' },
  { value: 'full', label: 'Full Page', icon: Code, description: 'Convert entire page' },
  { value: 'links', label: 'Links', icon: Link2, description: 'Extract all links' },
  { value: 'metadata', label: 'Metadata', icon: Braces, description: 'OG tags, title, description' },
] as const

type OutputTab = 'markdown' | 'json' | 'metadata' | 'links'

function Processor() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState('smart')
  const [markdownOutput, setMarkdownOutput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [metadataOutput, setMetadataOutput] = useState<any>(null)
  const [linksOutput, setLinksOutput] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<OutputTab>('markdown')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('markify_history') || '[]')
    } catch {
      return []
    }
  })
  const [fetchEngine, setFetchEngine] = useState<string>('')
  const [fetchMs, setFetchMs] = useState<number>(0)

  const handleProcess = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to process')
      return
    }

    // Ensure URL has a protocol
    let processedUrl = url.trim()
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/v1/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: processedUrl,
          mode,
          formats: ['both'],
          include_links: true,
        }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        setMarkdownOutput(data.data.markdown || '')
        setJsonOutput(data.data.json_content ? JSON.stringify(data.data.json_content, null, 2) : '')
        setMetadataOutput(data.data.metadata || null)
        setLinksOutput(data.data.links || [])
        setFetchEngine(data.meta?.engine || '')
        setFetchMs(data.meta?.fetch_ms || 0)

        // Update history
        const newHistory = [processedUrl, ...history.filter(h => h !== processedUrl)].slice(0, 50)
        setHistory(newHistory)
        localStorage.setItem('markify_history', JSON.stringify(newHistory))
      } else {
        setError(data.error || 'Processing failed')
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.')
      console.error('Processing error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    const content = activeTab === 'markdown' ? markdownOutput
      : activeTab === 'json' ? jsonOutput
      : activeTab === 'metadata' ? JSON.stringify(metadataOutput, null, 2)
      : JSON.stringify(linksOutput, null, 2)

    if (!content) return

    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const content = activeTab === 'markdown' ? markdownOutput
      : activeTab === 'json' ? jsonOutput
      : activeTab === 'metadata' ? JSON.stringify(metadataOutput, null, 2)
      : JSON.stringify(linksOutput, null, 2)

    if (!content) return

    const ext = activeTab === 'markdown' ? 'md' : 'json'
    const blob = new Blob([content], { type: 'text/plain' })
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `markify-output.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  }

  const handleClear = () => {
    setUrl('')
    setMarkdownOutput('')
    setJsonOutput('')
    setMetadataOutput(null)
    setLinksOutput([])
    setError(null)
    setFetchEngine('')
    setFetchMs(0)
  }

  const tabs: { key: OutputTab; label: string; count?: number }[] = [
    { key: 'markdown', label: 'Markdown' },
    { key: 'json', label: 'JSON' },
    { key: 'metadata', label: 'Metadata' },
    { key: 'links', label: 'Links', count: linksOutput.length || undefined },
  ]

  const hasOutput = markdownOutput || jsonOutput || metadataOutput || linksOutput.length > 0

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <h1 className="text-2xl font-bold gradient-text">Markify</h1>
          </div>
          <div className="text-sm text-gray-500">URL Processor & AI Data Layer</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* URL Input */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
                placeholder="Enter URL to process (e.g., https://example.com/article)"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary-500 placeholder:text-gray-600"
              />
            </div>
            <button
              onClick={handleProcess}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-700 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Process
                </>
              )}
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex flex-wrap gap-2 mt-4">
            {EXTRACTION_MODES.map((m) => {
              const Icon = m.icon
              return (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    mode === m.value
                      ? 'bg-primary-600/20 border-primary-500/50 border text-primary-400'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                  title={m.description}
                >
                  <Icon className="w-4 h-4" />
                  {m.label}
                </button>
              )
            })}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 self-center">Recent:</span>
              {history.slice(0, 5).map((h, i) => (
                <button
                  key={i}
                  onClick={() => setUrl(h)}
                  className="text-xs text-gray-500 hover:text-gray-300 truncate max-w-[200px]"
                >
                  {h.replace(/^https?:\/\//, '')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Engine Indicator */}
        {fetchEngine && (
          <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
            <span className={`px-2 py-0.5 rounded text-xs ${
              fetchEngine === 'browser' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {fetchEngine === 'browser' ? '🌐 Browser' : '⚡ HTTP'}
            </span>
            <span>{fetchMs}ms fetch time</span>
          </div>
        )}

        {/* Toolbar */}
        {hasOutput && (
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-200 text-sm ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        )}

        {/* Output Tabs */}
        {hasOutput && (
          <div className="glass rounded-xl overflow-hidden">
            <div className="flex border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.key
                      ? 'text-primary-400 border-b-2 border-primary-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-1 text-xs text-gray-600">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 min-h-[400px] max-h-[calc(100vh-350px)] overflow-auto">
              {activeTab === 'markdown' && (
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                  {markdownOutput || 'No markdown output'}
                </pre>
              )}
              {activeTab === 'json' && (
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                  {jsonOutput || '{}'}
                </pre>
              )}
              {activeTab === 'metadata' && (
                <div className="space-y-3">
                  {metadataOutput ? (
                    Object.entries(metadataOutput).map(([key, value]) => (
                      <div key={key} className="flex gap-3">
                        <span className="text-gray-500 text-sm min-w-[150px]">{key}</span>
                        <span className="text-gray-300 text-sm">{String(value)}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-600">No metadata</span>
                  )}
                </div>
              )}
              {activeTab === 'links' && (
                <div className="space-y-2">
                  {linksOutput.length > 0 ? (
                    linksOutput.map((link, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Link2 className="w-3 h-3 text-gray-600 shrink-0" />
                        <span className="text-gray-300 truncate">{link.text || link.url}</span>
                        <span className="text-gray-600 text-xs truncate ml-auto">{link.url}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-600">No links found</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasOutput && !isLoading && (
          <div className="glass rounded-xl p-12 text-center">
            <Globe className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Enter a URL to get started</h3>
            <p className="text-gray-600">
              Paste any URL above to extract its content as clean Markdown and structured JSON
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                'https://en.wikipedia.org/wiki/Web_scraping',
                'https://news.ycombinator.com',
                'https://docs.python.org/3/tutorial/index.html',
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setUrl(example)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-all"
                >
                  {example.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>Markify 2.0 — The MIT-licensed web data layer for AI agents</p>
        </div>
      </footer>
    </div>
  )
}

export default Processor
