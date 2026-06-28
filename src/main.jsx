import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// ── Top-level Error Boundary ─────────────────────────────────────────────────
// Shows the exact error message on screen instead of a blank white page.
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }

  static getDerivedStateFromError(error) { return { error } }

  componentDidCatch(error, info) {
    console.error('[AI Excellence LaunchPad] Render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', background: '#080810', color: '#e7e5e4',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif',
          padding: '2rem', textAlign: 'center', gap: '1rem'
        }}>
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Something went wrong
          </h1>
          <pre style={{
            color: '#f97316', fontSize: '0.75rem', margin: 0,
            maxWidth: 600, wordBreak: 'break-word', whiteSpace: 'pre-wrap',
            background: '#1c1917', padding: '1rem', borderRadius: '12px',
            textAlign: 'left',
          }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <p style={{ color: '#78716c', fontSize: '0.8rem', margin: 0 }}>
            Check the browser DevTools console (F12) for full details.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#C8421A', color: '#fff', border: 'none',
                borderRadius: '12px', padding: '0.6rem 1.2rem',
                fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem'
              }}
            >
              Reload page
            </button>
            <button
              onClick={() => { localStorage.clear(); window.location.reload() }}
              style={{
                background: 'transparent', color: '#78716c', border: '1px solid #292524',
                borderRadius: '12px', padding: '0.6rem 1.2rem',
                fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem'
              }}
            >
              Clear data &amp; reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ── PWA update prompt ────────────────────────────────────────────────────────
try {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New version available! Reload to update?')) updateSW(true)
    }
  })
} catch (e) {
  console.warn('[PWA] Service worker registration failed:', e)
}

// ── Mount ────────────────────────────────────────────────────────────────────
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
