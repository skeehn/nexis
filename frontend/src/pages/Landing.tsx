import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Code, Download, ChevronDown, Cpu, Search, Brain } from 'lucide-react'

function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Rust-native engine with streaming HTML parsing. 5-6KB memory footprint regardless of page size.',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Native Extraction',
      description: 'Multi-strategy extraction: Readability for articles, lol_html for streaming, metadata for OG tags and JSON-LD.',
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: 'MCP-First',
      description: 'Built-in MCP server for Claude, Cursor, and Windsurf. Give AI agents reliable web access out of the box.',
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Search + Scrape',
      description: 'Find pages with web search, then extract clean Markdown and structured JSON in one call.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'MIT Licensed',
      description: 'Enterprise-friendly. No AGPL restrictions. Self-host as a single binary or use managed cloud.',
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: 'SDKs & Integrations',
      description: 'Python, TypeScript, and Rust SDKs. LangChain, LlamaIndex, and CrewAI integrations.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section with Video */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/dithered-video.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950/70 to-gray-950" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="gradient-text">Markify</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto"
          >
            The MIT-licensed web data layer for AI agents.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-gray-500 mb-8 max-w-2xl mx-auto"
          >
            Scrape, search, extract, and structure web data — faster than anything else.
            Built with Rust for speed, MCP-first for distribution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/processor')}
              className="group px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 glow"
            >
              Try URL Processor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/app')}
              className="px-8 py-4 glass rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-200"
            >
              HTML → Markdown
            </button>
            <a
              href="#features"
              className="px-8 py-4 glass rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-200"
            >
              Learn More
            </a>
          </motion.div>

          {/* Install Command */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 font-mono"
          >
            <Code className="w-4 h-4" />
            <span>cargo install markify</span>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-gray-400 animate-bounce" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="gradient-text">Markify</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The fastest, most flexible, and only MIT-licensed web data layer
              built specifically for AI agents and modern workflows
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-primary-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Enter URL', desc: 'Paste a URL or use MCP from Claude/Cursor' },
              { step: '2', title: 'Smart Fetch', desc: 'HTTP first, browser fallback for JS pages' },
              { step: '3', title: 'Extract', desc: 'Article, metadata, links — all at once' },
              { step: '4', title: 'Get Results', desc: 'Clean Markdown + structured JSON output' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Positioning */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built Different
            </h2>
          </motion.div>

          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">Feature</th>
                    <th className="p-4 text-primary-400 font-semibold">Markify</th>
                    <th className="p-4 text-gray-500">Firecrawl</th>
                    <th className="p-4 text-gray-500">Jina</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'License', markify: 'MIT ✅', firecrawl: 'AGPL ⚠️', jina: 'Apache' },
                    { feature: 'Language', markify: 'Rust', firecrawl: 'Python/TS', jina: 'Python' },
                    { feature: 'MCP-First', markify: '✅', firecrawl: '❌', jina: '❌' },
                    { feature: 'Single Binary', markify: '✅', firecrawl: '❌', jina: '❌' },
                    { feature: 'Memory Footprint', markify: '5-6KB', firecrawl: '~50MB', jina: '~200MB' },
                    { feature: 'Self-Hosted', markify: '✅', firecrawl: 'Complex', jina: 'Limited' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="p-4 text-gray-300">{row.feature}</td>
                      <td className="p-4 text-primary-400 text-center">{row.markify}</td>
                      <td className="p-4 text-gray-500 text-center">{row.firecrawl}</td>
                      <td className="p-4 text-gray-500 text-center">{row.jina}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Process the Web?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Start scraping URLs, extracting content, and feeding clean data to your AI agents
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/processor')}
              className="group px-10 py-5 bg-primary-600 hover:bg-primary-500 rounded-lg font-semibold text-xl transition-all duration-200 flex items-center justify-center gap-3 glow mx-auto sm:mx-0"
            >
              Launch URL Processor
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/app')}
              className="px-10 py-5 glass rounded-lg font-semibold text-xl hover:bg-white/10 transition-all duration-200"
            >
              HTML → Markdown
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>Built with ❤️ using Rust, React, and Tailwind CSS • MIT License</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
