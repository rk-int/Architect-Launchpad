// All app state lives here. No backend, no network calls.
import { getDefaultExamDate, QUIZ_HISTORY_CAP } from './constants'

const KEYS = {
  SETUP: 'cca_setup_complete',
  USER: 'cca_user',
  COMPLETIONS: 'cca_completions_v2',
  STREAK: 'cca_streak_v2',
  QUIZ_HISTORY: 'cca_quiz_history_v2',
}

// --- User ---
export const getUser = () => {
  try {
    const data = JSON.parse(localStorage.getItem(KEYS.USER))
    if (!data || typeof data !== 'object') return null
    return data
  } catch { return null }
}
export const saveUser = (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user))
export const isSetupComplete = () => !!localStorage.getItem(KEYS.SETUP)
export const markSetupComplete = () => localStorage.setItem(KEYS.SETUP, '1')

// --- Task Completions ---
export const getCompletions = () => {
  try { return new Set(JSON.parse(localStorage.getItem(KEYS.COMPLETIONS)) || []) }
  catch { return new Set() }
}
export const saveCompletions = (set) =>
  localStorage.setItem(KEYS.COMPLETIONS, JSON.stringify([...set]))

// --- Streak (DST-safe using date arithmetic, not ms subtraction) ---
export const getStreak = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.STREAK)) || { count: 0, lastDate: null } }
  catch { return { count: 0, lastDate: null } }
}

function getYesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toDateString()
}

export const updateStreak = () => {
  const today = new Date().toDateString()
  const yesterday = getYesterdayStr()
  const s = getStreak()
  if (s.lastDate === today) return s.count
  const count = s.lastDate === yesterday ? s.count + 1 : 1
  localStorage.setItem(KEYS.STREAK, JSON.stringify({ count, lastDate: today }))
  return count
}

export const computeStreak = () => {
  const s = getStreak()
  const today = new Date().toDateString()
  const yesterday = getYesterdayStr()
  if (s.lastDate === today || s.lastDate === yesterday) return s.count
  return 0
}

// --- Quiz History (cap increased to 100) ---
export const getQuizHistory = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.QUIZ_HISTORY)) || [] }
  catch { return [] }
}
export const saveQuizResult = (result) => {
  const history = getQuizHistory()
  localStorage.setItem(KEYS.QUIZ_HISTORY, JSON.stringify([result, ...history].slice(0, QUIZ_HISTORY_CAP)))
}

// --- Reset ---
export const resetProgress = () => {
  localStorage.removeItem(KEYS.COMPLETIONS)
  localStorage.removeItem(KEYS.STREAK)
  localStorage.removeItem(KEYS.QUIZ_HISTORY)
}

// --- Export ---
export const exportData = () => {
  const data = {
    exportedAt: new Date().toISOString(),
    appVersion: '3.0.0',
    user: getUser(),
    completions: [...getCompletions()],
    streak: getStreak(),
    quizHistory: getQuizHistory(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cca-prep-export-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// --- Import ---
export const importData = async (file) => {
  const text = await file.text()
  const data = JSON.parse(text)
  if (!data || typeof data !== 'object') throw new Error('Invalid export file')
  if (data.user && typeof data.user === 'object') saveUser(data.user)
  if (Array.isArray(data.completions)) saveCompletions(new Set(data.completions))
  if (data.streak && typeof data.streak === 'object') {
    localStorage.setItem(KEYS.STREAK, JSON.stringify(data.streak))
  }
  if (Array.isArray(data.quizHistory)) {
    localStorage.setItem(KEYS.QUIZ_HISTORY, JSON.stringify(data.quizHistory.slice(0, QUIZ_HISTORY_CAP)))
  }
}
