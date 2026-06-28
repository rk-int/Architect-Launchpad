import { useState, useCallback, useMemo } from 'react'
import { getCompletions, saveCompletions, updateStreak, computeStreak, getUser } from './storage'
import { DOMAINS, getStudyPlanWeeks } from './data'

export function useProgress() {
  const [completions, setCompletions] = useState(() => getCompletions())
  const user = getUser() || {}

  // Resolve dynamic study plan weeks
  const activeWeeks = useMemo(() => {
    return getStudyPlanWeeks(user.startedAt, user.examDate)
  }, [user.startedAt, user.examDate])

  const allTasks = useMemo(() => {
    return activeWeeks.flatMap(w => w.tasks)
  }, [activeWeeks])

  const total = useMemo(() => allTasks.length, [allTasks])

  const toggle = useCallback((taskId) => {
    setCompletions(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) next.delete(taskId)
      else { next.add(taskId); updateStreak() }
      saveCompletions(next)
      return next
    })
  }, [])

  const stats = useMemo(() => {
    const done = allTasks.filter(t => completions.has(t.id)).length
    const pct = total ? Math.round((done / total) * 100) : 0

    const weekProgress = activeWeeks.map(w => {
      const wDone = w.tasks.filter(t => completions.has(t.id)).length
      return { weekId: w.id, done: wDone, total: w.tasks.length, pct: w.tasks.length ? Math.round((wDone / w.tasks.length) * 100) : 0 }
    })

    const domainProgress = Object.fromEntries(
      DOMAINS.map(d => {
        const dTasks = allTasks.filter(t => t.domain === d.id)
        const dDone = dTasks.filter(t => completions.has(t.id)).length
        return [d.id, { done: dDone, total: dTasks.length, pct: dTasks.length ? Math.round((dDone / dTasks.length) * 100) : 0 }]
      })
    )

    const weeksComplete = weekProgress.filter(w => w.pct === 100).length
    const streak = computeStreak()

    return { done, total, pct, weekProgress, domainProgress, weeksComplete, streak, activeWeeks }
  }, [completions, activeWeeks, allTasks, total])

  return { completions, toggle, ...stats }
}
