import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function DatePicker({ value, onChange, min }) {
  const today = new Date(); today.setHours(0,0,0,0)
  const minDate = min ? new Date(min + 'T00:00:00') : today

  const parseDate = (v) => v ? new Date(v + 'T00:00:00') : null
  const selected = parseDate(value)

  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => {
    const d = selected || minDate
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const prevMonth = () => setView(v => {
    const d = new Date(v.year, v.month - 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const nextMonth = () => setView(v => {
    const d = new Date(v.year, v.month + 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const firstDay = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()

  const selectDay = (day) => {
    const d = new Date(view.year, view.month, day)
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    onChange(iso)
    setOpen(false)
  }

  const isDisabled = (day) => {
    const d = new Date(view.year, view.month, day); d.setHours(0,0,0,0)
    return d < minDate
  }
  const isSelected = (day) => {
    if (!selected) return false
    return selected.getFullYear() === view.year && selected.getMonth() === view.month && selected.getDate() === day
  }
  const isToday = (day) => {
    return today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === day
  }

  const displayValue = selected
    ? selected.toLocaleDateString('en-US', { weekday:'short', year:'numeric', month:'long', day:'numeric' })
    : 'Pick your exam date'

  return (
    <div ref={ref} style={{ position: 'relative', zIndex: 50 }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgb(2 6 23)',
          border: `1px solid ${open ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: '1rem',
          padding: '1rem 1.25rem',
          color: selected ? '#e2e8f0' : '#475569',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          outline: 'none',
        }}
      >
        <span>{displayValue}</span>
        <Calendar size={15} style={{ color: open ? '#f97316' : '#64748b', flexShrink: 0 }} />
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, rgb(2,6,23) 0%, rgb(15,23,42) 100%)',
          border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: '1rem',
          padding: '1rem',
          zIndex: 9999,
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03)',
        }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
            <button type="button" onClick={prevMonth} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:'4px 8px', borderRadius:'6px' }}
              onMouseEnter={e=>e.target.style.color='#f97316'} onMouseLeave={e=>e.target.style.color='#94a3b8'}>
              <ChevronLeft size={14} />
            </button>
            <span style={{ color:'#f1f5f9', fontWeight:700, fontSize:'0.875rem', fontFamily:'monospace', letterSpacing:'0.05em' }}>
              {MONTHS[view.month]} {view.year}
            </span>
            <button type="button" onClick={nextMonth} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:'4px 8px', borderRadius:'6px' }}
              onMouseEnter={e=>e.target.style.color='#f97316'} onMouseLeave={e=>e.target.style.color='#94a3b8'}>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px', marginBottom:'4px' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign:'center', fontSize:'9px', color:'#475569', fontFamily:'monospace', fontWeight:700, padding:'4px 0', textTransform:'uppercase', letterSpacing:'0.05em' }}>{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px' }}>
            {/* Empty cells */}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const disabled = isDisabled(day)
              const sel = isSelected(day)
              const tod = isToday(day)

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && selectDay(day)}
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: sel ? 800 : 400,
                    padding: '6px 2px',
                    borderRadius: '6px',
                    border: tod && !sel ? '1px solid rgba(249,115,22,0.4)' : '1px solid transparent',
                    background: sel ? '#ea580c' : 'transparent',
                    color: disabled ? '#1e293b' : sel ? '#fff' : tod ? '#f97316' : '#cbd5e1',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!disabled && !sel) e.currentTarget.style.background = 'rgba(249,115,22,0.15)' }}
                  onMouseLeave={e => { if (!disabled && !sel) e.currentTarget.style.background = 'transparent' }}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{ marginTop:'0.75rem', paddingTop:'0.75rem', borderTop:'1px solid rgba(255,255,255,0.04)', textAlign:'center' }}>
            <button
              type="button"
              onClick={() => {
                const iso = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
                setView({ year: today.getFullYear(), month: today.getMonth() })
                if (!isDisabled(today.getDate()) || true) onChange(iso)
              }}
              style={{ fontSize:'9px', color:'#475569', background:'none', border:'none', cursor:'pointer', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.1em' }}
              onMouseEnter={e=>e.target.style.color='#f97316'} onMouseLeave={e=>e.target.style.color='#475569'}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
