import { useState } from 'react'
import { BookOpen, Search, Filter, X, Clock, ArrowUpRight } from 'lucide-react'

import { DIGEST_GUIDES } from '../lib/digestData'

export default function ArchitectDigest() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeGuide, setActiveGuide] = useState(null)

  const categories = ['All', ...new Set(DIGEST_GUIDES.map(g => g.category))]

  const filteredGuides = DIGEST_GUIDES.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
                          g.summary.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="px-4 lg:px-8 pt-6 pb-12 max-w-4xl space-y-6 relative z-10">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <p className="text-xs font-mono text-orange-400 tracking-widest uppercase mb-1">Knowledge Library</p>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          Architect Digest
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-1">
          Deep-dives, cheatsheets, and production patterns for aspiring Claude Architects
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/40 p-4 border border-slate-700 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text"
            placeholder="Search guides and cheatsheets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/30 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-orange-600 border-orange-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(255,107,0,0.2)]' 
                  : 'bg-slate-900/30 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Guides' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGuides.map(guide => (
          <div 
            key={guide.id}
            onClick={() => setActiveGuide(guide)}
            className="neo-glass rounded-3xl p-5 border border-white/5 hover:border-orange-500/25 hover:shadow-[0_0_20px_rgba(255,107,0,0.04)] transition-all duration-300 relative group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-orange-400 font-bold uppercase tracking-wider bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                  {guide.category}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock size={11} /> {guide.readTime}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-200 group-hover:text-orange-400 transition-colors leading-snug">
                {guide.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {guide.summary}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-orange-500/80 font-bold uppercase tracking-wider pt-4 mt-auto group-hover:text-orange-400 transition-colors">
              Read Guide <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        ))}
        {filteredGuides.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 text-sm font-mono border border-dashed border-white/5 rounded-3xl">
            No guides match your search criteria.
          </div>
        )}
      </div>

      {/* Expanded Reading Modal */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="neo-glass w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden border border-white/10 flex flex-col shadow-2xl glowing-border-orange">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start gap-4 flex-shrink-0 bg-slate-950/40">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/25">
                  {activeGuide.category}
                </span>
                <h2 className="text-lg font-black text-slate-100 leading-snug pt-1">
                  {activeGuide.title}
                </h2>
              </div>
              <button 
                onClick={() => setActiveGuide(null)}
                className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 prose prose-invert max-w-none text-xs md:text-sm text-slate-300 leading-relaxed font-sans scrollbar-custom">
              {activeGuide.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-sm md:text-base font-black text-slate-100 mt-6 first:mt-0 border-b border-white/5 pb-2 font-mono">{paragraph.replace('### ', '')}</h3>
                }
                if (paragraph.startsWith('#### ')) {
                  return <h4 key={index} className="text-xs md:text-sm font-bold text-orange-400 mt-4 leading-tight">{paragraph.replace('#### ', '')}</h4>
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-1">
                      {paragraph.split('\n').map((li, lIdx) => (
                        <li key={lIdx}>{li.replace('- ', '')}</li>
                      ))}
                    </ul>
                  )
                }
                if (paragraph.startsWith('| ')) {
                  const rows = paragraph.split('\n')
                  return (
                    <div key={index} className="overflow-x-auto my-4 border border-white/5 rounded-xl">
                      <table className="w-full text-[11px] md:text-xs text-left border-collapse">
                        <tbody>
                          {rows.map((row, rIdx) => {
                            const cells = row.split('|').map(c => c.trim()).filter((c, cIdx) => cIdx > 0 && cIdx < row.split('|').length - 1)
                            const isHeader = rIdx === 0
                            const isDivider = row.includes(':---') || row.includes('---')
                            if (isDivider) return null
                            return (
                              <tr key={rIdx} className={isHeader ? 'bg-slate-900 border-b border-white/10 font-bold' : 'border-b border-white/5 hover:bg-white/[0.01]'}>
                                {cells.map((cell, cIdx) => (
                                  isHeader ? (
                                    <th key={cIdx} className="p-2.5 font-mono text-orange-400">{cell}</th>
                                  ) : (
                                    <td key={cIdx} className="p-2.5" dangerouslySetInnerHTML={{ __html: cell.replace(/`([^`]+)`/g, '<code class="text-orange-400 font-mono bg-slate-950 px-1 py-0.5 rounded border border-white/5">$1</code>') }} />
                                  )
                                ))}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )
                }
                if (paragraph.startsWith('```')) {
                  const code = paragraph.replace(/```[a-z]*/g, '').trim()
                  return (
                    <pre key={index} className="bg-slate-950 border border-white/5 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed my-4">
                      {code}
                    </pre>
                  )
                }
                return (
                  <p 
                    key={index} 
                    dangerouslySetInnerHTML={{ 
                      __html: paragraph
                        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                        .replace(/_([^_]+)_/g, '<em>$1</em>')
                        .replace(/`([^`]+)`/g, '<code class="text-orange-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-white/5">$1</code>')
                    }} 
                  />
                )
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 bg-slate-950/40 text-center flex-shrink-0">
              <button 
                onClick={() => setActiveGuide(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 border border-white/5 text-xs font-mono text-slate-300 hover:text-slate-100 rounded-full transition-all cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
