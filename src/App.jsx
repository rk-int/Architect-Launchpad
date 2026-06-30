import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isSetupComplete } from './lib/storage'
import { ThemeProvider } from './lib/ThemeContext'

// Eager imports for Layout and loader — never lazy, always available
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

