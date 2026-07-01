import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isSetupComplete } from './lib/storage'
import { ThemeProvider } from './lib/ThemeContext'
import vercelConfig from '../vercel-config.json'
import Layout from './components/Layout'
import PageLoader from './components/PageLoader'

// Route-level lazy loading — only splits JS, does NOT affect render
const Onboarding  = lazy(() => import('./pages/Onboarding'))
const Home        = lazy(() => import('./pages/Home'))
const StudyPlan   = lazy(() => import('./pages/StudyPlan'))
const WeekDetail  = lazy(() => import('./pages/WeekDetail'))
const Quiz        = lazy(() => import('./pages/Quiz'))
const QuizActive  = lazy(() => import('./pages/QuizActive'))
const QuizResults = lazy(() => import('./pages/QuizResults'))
const Progress    = lazy(() => import('./pages/Progress'))
const Settings    = lazy(() => import('./pages/Settings'))
const Reference   = lazy(() => import('./pages/Reference'))
const References  = lazy(() => import('./pages/References'))
const CertificationRoadmap = lazy(() => import('./pages/CertificationRoadmap'))
const AboutMe = lazy(() => import('./pages/AboutMe'))
const ArchitectDigest = lazy(() => import('./pages/ArchitectDigest'))

function Guard({ children }) {
  if (!isSetupComplete()) return <Navigate to="/onboarding" replace />
  return children
}

export default function App() {
  const isHosted = vercelConfig["Host on vercel"]?.toLowerCase() === 'yes'

  if (!isHosted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
        {/* Decorative background grid and aura */}
        <div className="absolute inset-0 grid-matrix opacity-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full filter blur-[100px]" />
        
        <div className="relative z-10 space-y-6 max-w-md bg-slate-900/40 border border-red-500/20 p-8 md:p-10 rounded-3xl backdrop-blur-2xl shadow-2xl glowing-border-red">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-100 tracking-tight">Portal Suspended</h1>
            <p className="text-xs text-slate-400 font-mono">Status: HOSTING_DISABLED_BY_ADMIN</p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Claude Architect Portal has been taken offline. This instance is currently suspended under administrator instruction.
          </p>
          <div className="border-t border-white/5 pt-4 text-[10px] font-mono text-slate-500">
            Configure "Host on vercel" to "yes" to reactivate.
          </div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<Guard><Layout /></Guard>}>
              <Route index element={<Home />} />
              <Route path="plan" element={<StudyPlan />} />
              <Route path="plan/week/:weekId" element={<WeekDetail />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="quiz/active" element={<QuizActive />} />
              <Route path="quiz/results" element={<QuizResults />} />
              <Route path="progress" element={<Progress />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reference" element={<Reference />} />
              <Route path="references" element={<References />} />
              <Route path="roadmap" element={<CertificationRoadmap />} />
              <Route path="about" element={<AboutMe />} />
              <Route path="digest" element={<ArchitectDigest />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}

