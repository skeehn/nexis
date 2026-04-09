import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Routes, Route } from 'react-router-dom'
import {
  ArrowLeft,
  Copy,
  Download,
  Upload,
  Trash2,
  ArrowRightLeft,
  Check,
  Loader2,
} from 'lucide-react'
import Landing from './Landing'
import Processor from './Processor'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function ConverterApp() {
  const navigate = useNavigate()
  const [htmlInput, setHtmlInput] = useState('')
  const [markdownOutput, setMarkdownOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleConvert = async () => {
    if (!htmlInput.trim()) {
      setError('Please enter some HTML to convert')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: htmlInput }),
      })

      const data = await response.json()

      if (data.success) {
        setMarkdownOutput(data.markdown)
      } else {
        setError(data.error || 'Conversion failed')
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.')
      console.error('Conversion error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!markdownOutput) return

    await navigator.clipboard.writeText(markdownOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!markdownOutput) return

    const blob = new Blob([markdownOutput], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        setHtmlInput(content)
      }
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    setHtmlInput('')
    setMarkdownOutput('')
    setError(null)
  }

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
          <div className="text-sm text-gray-500">HTML → Markdown Converter</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={handleConvert}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-700 rounded-lg font-semibold transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <ArrowRightLeft className="w-5 h-5" />
                Convert
              </>
            )}
          </button>

          <label className="flex items-center gap-2 px-4 py-3 glass rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200">
            <Upload className="w-5 h-5" />
            <span>Upload HTML</span>
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleCopy}
            disabled={!markdownOutput}
            className="flex items-center gap-2 px-4 py-3 glass rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Markdown
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={!markdownOutput}
            className="flex items-center gap-2 px-4 py-3 glass rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            Download .md
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-3 glass rounded-lg hover:bg-white/10 transition-all duration-200 ml-auto"
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
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

        {/* Split Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HTML Input */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-semibold">HTML Input</h2>
              <span className="text-xs text-gray-500">Paste your HTML here</span>
            </div>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="<!DOCTYPE html>
<html>
<head><title>Example</title></head>
<body>
  <h1>Hello World</h1>
  <p>This is a <strong>paragraph</strong> with some HTML.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</body>
</html>"
              className="w-full h-[calc(100vh-350px)] min-h-[400px] bg-transparent p-4 font-mono text-sm resize-none focus:outline-none placeholder:text-gray-600"
              spellCheck={false}
            />
          </div>

          {/* Markdown Output */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-semibold">Markdown Output</h2>
              <span className="text-xs text-gray-500">Converted Markdown</span>
            </div>
            <textarea
              value={markdownOutput}
              readOnly
              placeholder="# Your converted markdown will appear here..."
              className="w-full h-[calc(100vh-350px)] min-h-[400px] bg-transparent p-4 font-mono text-sm resize-none focus:outline-none placeholder:text-gray-600"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Sample HTML */}
        <div className="mt-8 glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Try a Sample</h3>
          <p className="text-gray-400 mb-4">
            Click below to load a sample HTML document
          </p>
          <button
            onClick={() =>
              setHtmlInput(`<!DOCTYPE html>
<html>
<head><title>Sample Document</title></head>
<body>
  <h1>Welcome to Markify</h1>
  <p>This is a <strong>sample HTML document</strong> to demonstrate the converter.</p>

  <h2>Features</h2>
  <ul>
    <li>Fast conversion with Rust</li>
    <li>Supports all common HTML elements</li>
    <li>Clean, readable output</li>
  </ul>

  <h2>Code Example</h2>
  <pre><code>fn main() {
    println!("Hello, world!");
}</code></pre>

  <p>Visit <a href="https://example.com">Example.com</a> for more info.</p>

  <blockquote>
    <p>This is a blockquote with some important text.</p>
  </blockquote>

  <h3>Table Example</h3>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>City</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John</td>
        <td>30</td>
        <td>New York</td>
      </tr>
      <tr>
        <td>Jane</td>
        <td>25</td>
        <td>London</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`)
            }
            className="px-6 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg font-semibold transition-all duration-200"
          >
            Load Sample HTML
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>Built with Rust + React • Fast, accurate HTML to Markdown conversion</p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<ConverterApp />} />
      <Route path="/processor" element={<Processor />} />
    </Routes>
  )
}
