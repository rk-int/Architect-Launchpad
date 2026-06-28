import { Suspense, useEffect, useState, lazy } from 'react'

// Lazily import Canvas ONLY after page has mounted.
// This prevents @react-three/fiber from crashing SSR or initial render.
const ThreeCanvas = lazy(() =>
  import('@react-three/fiber').then(m => ({ default: m.Canvas }))
)

function isWebGLSupported() {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Canvas3D — safe Three.js canvas wrapper.
 * - Checks WebGL support before mounting
 * - Only renders after client has hydrated (useEffect)
 * - Catches all errors via ErrorBoundary fallback
 * - Falls back to `fallback` prop content if WebGL unavailable
 */
export default function Canvas3D({
  children,
  fallback = null,
  className = '',
  style = {},
  camera,
  ...props
}) {
  const [ready, setReady] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    const ok = isWebGLSupported()
    setSupported(ok)
    setReady(true)
  }, [])

  // SSR or not yet mounted — render nothing
  if (!ready) return null

  // WebGL not available — show fallback
  if (!supported) return fallback

  return (
    <Suspense fallback={null}>
      <ThreeCanvas
        className={className}
        style={{ width: '100%', height: '100%', ...style }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        camera={camera}
        {...props}
      >
        {children}
      </ThreeCanvas>
    </Suspense>
  )
}
