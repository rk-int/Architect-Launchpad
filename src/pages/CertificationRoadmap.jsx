import { useState, useRef } from 'react'
import { useTheme } from '../lib/ThemeContext'
import { Map, Maximize2, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react'

export default function CertificationRoadmap() {
  const { theme } = useTheme()
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const [zoomScale, setZoomScale] = useState(2.2) // Default zoom scale

  const isDark = theme === 'dark'

  // Mouse move handler for the zoomed pan effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  // Handle zoom adjustments inside modal
  const zoomIn = (e) => {
    e.stopPropagation()
    setZoomScale(prev => Math.min(prev + 0.5, 5))
  }

  const zoomOut = (e) => {
    e.stopPropagation()
    setZoomScale(prev => Math.max(prev - 0.5, 1))
  }

  const resetZoom = (e) => {
    e.stopPropagation()
    setZoomScale(2.2)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.12)]">
            <Map size={22} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">
              Learning Flow
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Official Claude Certified Architect Mind Map
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsZoomed(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(255,107,0,0.05)] cursor-pointer"
        >
          <Maximize2 size={13} />
          <span>Explore HD Mind Map</span>
        </button>
      </div>

      {/* ── Info Box ── */}
      <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 block">
            Status
          </span>
          <span className="text-sm font-semibold text-slate-300">
            Roadmap loaded in perfect landscape mode. Click the poster to zoom and inspect the curriculum node details.
          </span>
        </div>
        <div
          className={`text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border flex-shrink-0 text-center ${
            isDark
              ? 'text-orange-400 border-orange-500/30 bg-orange-500/10'
              : 'text-sky-400 border-sky-500/30 bg-sky-500/10'
          }`}
        >
          {isDark ? '🌙 Dark Active' : '☀️ Light Active'}
        </div>
      </div>

      {/* ── Main Poster Container (Click to Zoom) ── */}
      <div 
        onClick={() => setIsZoomed(true)}
        className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.6)] bg-slate-950/60 cursor-zoom-in group"
      >
        {/* Glow Ring */}
        <div
          className={`absolute inset-0 rounded-3xl transition-all duration-700 pointer-events-none z-10 ${
            isDark
              ? 'shadow-[inset_0_0_60px_rgba(255,107,0,0.04)]'
              : 'shadow-[inset_0_0_60px_rgba(56,189,248,0.04)]'
          }`}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-10 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.2)] animate-pulse">
            <ZoomIn size={20} className="text-orange-400" />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase bg-slate-950/80 px-4 py-1.5 rounded-full border border-white/10">
            Click to Open HD Zoom
          </span>
        </div>

        {/* The static roadmap poster in landscape mode */}
        <img
          src="/assets/roadmap-poster.jpg"
          alt="Claude Certified Architect Certification Roadmap Mind Map"
          className="w-full h-full object-cover block"
          loading="eager"
        />
      </div>

      {/* ── Curricula Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Map Resolution', value: '2752 × 1536', sub: 'Ultra High Definition' },
          { label: 'Curriculum Domains', value: '5 Key Areas', sub: 'Official certification content' },
          { label: 'Exploration Mode', value: 'Interactive Zoom', sub: 'Hover/Pan text reader' },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 flex flex-col gap-1 hover:border-orange-500/20 transition-all duration-300"
          >
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">{label}</span>
            <span className="text-xl font-black text-slate-100">{value}</span>
            <span className="text-[11px] text-slate-500">{sub}</span>
          </div>
        ))}
      </div>

      {/* ── Zoomed Full Page Modal ── */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col animate-fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                HD Zoom Explorer
              </span>
              <span className="text-xs text-slate-400 hidden md:inline font-mono">
                • Hover to Pan • Scale: {zoomScale.toFixed(1)}x
              </span>
            </div>

            {/* Interactive Zoom Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 border border-white/5 rounded-xl overflow-hidden mr-2">
                <button
                  onClick={zoomOut}
                  className="p-2.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors border-r border-white/5 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={resetZoom}
                  className="p-2.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors border-r border-white/5 cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={zoomIn}
                  className="p-2.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              <button
                onClick={() => setIsZoomed(false)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
                title="Close Explorer"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Interactive Zoom/Pan Canvas */}
          <div
            className="flex-1 w-full relative overflow-hidden flex items-center justify-center bg-slate-950 cursor-crosshair select-none"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsZoomed(false)}
          >
            {/* The actual image being scaled and repositioned */}
            <div 
              className="w-full max-w-6xl aspect-video relative transition-transform duration-200 ease-out"
              style={{
                transform: isHovered ? `scale(${zoomScale})` : 'scale(1)',
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              }}
            >
              <img
                src="/assets/roadmap-poster.jpg"
                alt="Zoomed HD Certification Roadmap Poster"
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            {/* Instruction Banner at the bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full text-xs font-mono font-semibold tracking-wider text-slate-300 shadow-2xl pointer-events-none text-center">
              {isHovered ? 'Move mouse to Pan • Click anywhere to exit' : 'Hover over the roadmap to zoom & inspect text'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
