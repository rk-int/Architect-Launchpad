export default function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(200,66,26,0.12) 0%, transparent 60%), #080810',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Spinner */}
      <div style={{ position: 'relative', width: 48, height: 48 }}>
        {/* Track */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '2px solid #292524',
        }} />
        {/* Spinning arc */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#C8421A',
          animation: 'cca-spin 0.9s linear infinite',
        }} />
      </div>

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: 24, height: 24,
          borderRadius: 6,
          background: 'rgba(200,66,26,0.15)',
          border: '1px solid rgba(200,66,26,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <polygon points="12,3 23,21 1,21" stroke="#C8421A" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <span style={{ color: '#78716c', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600 }}>
          ANTHROPIC CLAUDE LAUNCHPAD
        </span>
      </div>

      {/* Keyframe injected safely */}
      <style>{`
        @keyframes cca-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
