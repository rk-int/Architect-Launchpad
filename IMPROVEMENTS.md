# AI Excellence LaunchPad — Project Improvement Analysis

> **Scope:** Full codebase review of `cca-prep-test` v2.0 — React 19, Vite 6, Tailwind CSS v4, vite-plugin-pwa.
> **Date:** June 2026
> **Status:** All items are suggestions; none break existing functionality.

---

## 1. Architecture & Code Quality

### 1.1 — Data Module Too Monolithic (`data.js` is 50 KB)

**Problem:** `data.js` is a single 302-line file containing WEEKS, DOMAINS, and QUIZ_QUESTIONS concatenated. At 50 KB it is loaded synchronously at boot, even on pages that don't need quiz data.

**Fix:**
```
src/lib/data/
  domains.js        ← DOMAINS constant only
  weeks.js          ← WEEKS array only
  quiz.js           ← QUIZ_QUESTIONS only
  index.js          ← re-exports all three
```
Allows route-level code splitting so quiz.js only loads when the user visits /quiz.

---

### 1.2 — Duplicated Business Logic

**Problem:** The exam-date calculation block appears in 3 files: Layout.jsx, Home.jsx, Progress.jsx. The fallback date '2026-05-30' is also repeated.

**Fix:** Create a single `useExamCountdown()` hook in `src/lib/useUser.js`:
```js
export function useExamCountdown() {
  const user = getUser()
  const examDate = user?.examDate ? new Date(user.examDate) : new Date('2026-07-30')
  const daysLeft = Math.max(0, Math.ceil((examDate - Date.now()) / 86400000))
  return { user, examDate, daysLeft }
}
```

---

### 1.3 — Guard Route Is a Non-Reactive Synchronous Check

**Problem:** `Guard` in App.jsx calls `isSetupComplete()` synchronously on every render and doesn't react to changes from other tabs.

**Fix:** Move setup state to a React context or `useSyncExternalStore` hook for reactivity.

---

### 1.4 — `useProgress` Re-computes Domain Stats in Two Full Passes

**Problem:** The `stats` useMemo runs O(tasks × domains) on every completions change — once for weekProgress and once for domainProgress.

**Fix:** Pre-compute a `taskByDomain` Map at module level (outside the hook) so each re-render is O(tasks).

---

### 1.5 — No Error Boundaries

**Problem:** If any page component throws (e.g. JSON.parse on corrupted localStorage), the user sees a blank screen with no recovery.

**Fix:** Wrap `<App>` in a top-level `<ErrorBoundary>` with a "Clear data and restart" button.

---

### 1.6 — Duplicate Import in `Layout.jsx`

Lines 3–4 import from the same module:
```js
import { getUser } from '../lib/storage'
import { computeStreak } from '../lib/storage'
```
**Fix:** Merge into one import statement.

---

## 2. State Management & Storage

### 2.1 — Data Import Is Not Implemented

**Problem:** `exportData()` exists but there is no `importData()`. The README claims "Data export / import via JSON" — this is incorrect.

**Fix:** Add `importData(file)` to `storage.js` and a file-input button in `Settings.jsx`.

---

### 2.2 — Quiz State Lost on Page Refresh

**Problem:** `QuizActive.jsx` reads config from `sessionStorage`. A page refresh mid-quiz loses all progress.

**Fix:** Persist in-progress quiz state to `localStorage` under `cca_quiz_in_progress`. On mount, offer "Resume quiz" or "Start fresh."

---

### 2.3 — Streak Breaks on DST Changeover Dates

**Problem:** `updateStreak()` uses `Date.now() - 86400000` for "yesterday" — wrong around DST transitions (23h or 25h day).

**Fix:**
```js
const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const yesterdayStr = yesterday.toDateString()
```

---

### 2.4 — Quiz History Capped Too Low (20 Entries)

**Problem:** 3 quizzes/week × 9 weeks = 27 sessions. Early history is lost before the study period ends.

**Fix:** Increase cap to 100 (still < 50 KB in localStorage).

---

## 3. UX & User Experience

### 3.1 — Hard-coded Exam Date '2026-05-30' Has Passed

**Problem:** The default exam date is past. New users see "0d to exam" immediately, which is disorienting. It appears in 4+ files.

**Fix:** Define one constant `DEFAULT_EXAM_DATE = '2026-07-30'` and update all references.

---

### 3.2 — Onboarding Statistics Are Wrong

The welcome screen shows:
- `42` Daily Tasks — not dynamically computed
- `13+` Quiz Questions — actual count is 22

**Fix:** Compute both values from the data arrays at render time.

---

### 3.3 — No Loading States or Skeleton UI

**Problem:** Pages flash/jump on slow devices with no loading indication.

**Fix:** Add CSS pulse skeleton placeholders for the stats grid and week cards on Home.jsx.

---

### 3.4 — No Celebration on Week Completion

**Problem:** The burst animation on task toggle is nearly invisible. No feedback when completing an entire week.

**Improvements:**
- Show a confetti overlay when week pct crosses 100%
- Use `navigator.vibrate?.(30)` on mobile on task completion
- Show a toast notification

---

### 3.5 — No Keyboard Navigation in Quiz

**Problem:** Users cannot press 1–4 to select answers or Enter to advance. Critical for desktop study sessions.

**Fix:**
```js
useEffect(() => {
  const handler = (e) => {
    if (!answered && ['1','2','3','4'].includes(e.key)) handleSelect(parseInt(e.key) - 1)
    if (answered && e.key === 'Enter') handleNext()
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [answered, current])
```

---

### 3.6 — No Question Navigation / Skip in Quiz

**Problem:** Questions are fully linear with no way to skip and return, and no question overview panel.

**Fix:** Add a numbered question map showing status (answered/unanswered/correct/wrong) for navigation.

---

### 3.7 — Quiz Results Don't Show Original Question Text

**Problem:** The results review panel only shows `a.explanation`. Users reviewing wrong answers can't see what was asked.

**Fix:** Store `questionText`, `options`, and `correctIndex` in the answers array when saving results.

---

### 3.8 — WeekDetail Not-Found State Has No Recovery Link

```js
if (!week) return <div className="p-8 text-stone-500">Week not found</div>
```
No navigation link back. Users are stuck unless they use the browser back button.

**Fix:** Add `<Link to="/plan">Back to Study Plan</Link>` to the not-found state.

---

## 4. Performance

### 4.1 — No Route-Level Code Splitting

**Problem:** All 9 page components are eagerly imported in App.jsx, bundled together, and loaded on first visit.

**Fix:** Use `React.lazy` + `Suspense` for heavy pages:
```js
const QuizActive = lazy(() => import('./pages/QuizActive'))
const QuizResults = lazy(() => import('./pages/QuizResults'))
const WeekDetail = lazy(() => import('./pages/WeekDetail'))
```
Estimated 15–20% reduction in initial JS parse time.

---

### 4.2 — ProgressRing SVG Text Is Not Accessible

**Problem:** Percentage text inside SVG `<text>` cannot be read by screen readers, cannot be selected, and ignores system font scaling.

**Fix:** Overlay an HTML `<div>` using absolute positioning instead of SVG text.

---

### 4.3 — PWA Icons Are Missing

**Problem:** `vite.config.js` references `pwa-192x192.png` and `pwa-512x512.png` but neither exists in `public/`. PWA install will fail or show a broken icon.

**Fix:** Generate icons with pwa-asset-generator and add to `public/`. Also add `favicon.ico` and `apple-touch-icon.png` to `index.html`.

---

### 4.4 — Workbox Glob Pattern Too Broad

```js
globPatterns: ['**/*.{js,css,html,ico,png,svg}']
```
Pre-caches every file including large chunks. Use StaleWhileRevalidate for JS and pre-cache only the HTML shell.

---

### 4.5 — No Manual Rollup Chunks Configured

**Fix:**
```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        icons: ['lucide-react'],
        data: ['./src/lib/data.js'],
      }
    }
  }
}
```

---

## 5. Accessibility (a11y)

### 5.1 — Navigation <button> Elements Should Be Links

Pages use `<button onClick={() => navigate('/...')}` for navigation. Screen readers announce these as buttons, not links.

**Fix:** Use `<Link>` or `<a>` for navigational elements; reserve `<button>` for actions.

---

### 5.2 — Icon-Only Buttons Have No ARIA Labels

Quiz close button: `<button><X size={20}/></button>` — screen readers say only "button."

**Fix:**
```jsx
<button aria-label="Exit quiz"><X size={20} aria-hidden="true" /></button>
```

---

### 5.3 — Progress Bars Have No ARIA Attributes

Every progress bar is visual-only with no `role="progressbar"`, `aria-valuenow`, or `aria-label`.

---

### 5.4 — No Visible Focus Ring on Quiz Answer Buttons

Answer buttons have no `focus-visible` ring due to Tailwind outline reset.

**Fix:** Add `focus-visible:ring-2 focus-visible:ring-orange-500` to answer button classes.

---

### 5.5 — Color Is the Sole Differentiator for Correct/Wrong Answers

Users with color blindness cannot distinguish correct (green) from incorrect (red) in QuizActive.

**Fix:** Add ✓ / ✗ icons next to the option letter on reveal (like QuizResults already does).

---

### 5.6 — Missing Meta Tags in `index.html`

Missing: `<meta name="description">`, Open Graph tags, `<link rel="icon">`, `<link rel="apple-touch-icon">`.

---

## 6. Quiz Engine

### 6.1 — Only 22 Questions for a 60-Question Exam

Users memorize the question pool after a few attempts instead of learning the material. Onboarding incorrectly shows `13+`.

**Fix:** Expand to 60+ questions minimum. Add difficulty ratings and per-question performance tracking.

---

### 6.2 — Timer: Mock Exam Is 100 Min, Real Exam Is 120 Min

```js
const timeLimit = config.type === 'mock' ? 6000 : ...
// 6000 seconds = 100 min; real exam = 120 min for 60 questions
```
Discrepancy trains users on wrong pacing.

---

### 6.3 — No Pause Functionality

Once started the timer runs continuously. Mobile users interrupted by notifications lose time.

**Fix:** Add a pause overlay that blurs the question and freezes the timer.

---

### 6.4 — Domain Distribution Is Uneven

Domains D1 (Agentic Architecture, 27% of exam) should have proportionally more questions. Current distribution has not been validated against exam domain weights.

---

## 7. Security & Best Practices

### 7.1 — No Schema Validation on Storage Reads

`getUser()`, `getCompletions()`, `getQuizHistory()` parse JSON but don't validate structure. Malformed data from a prior app version could cause runtime errors in components.

**Fix:** Add lightweight type guards to each storage reader.

---

### 7.2 — No Content Security Policy

No CSP headers configured. Add via `vercel.json` `headers` config.

---

## 8. Developer Experience

### 8.1 — No TypeScript / Type Safety

Complex nested data shapes (WEEKS, QUIZ_QUESTIONS) have no types. Bugs in data access are only caught at runtime.

**Fix:** Migrate to TypeScript or add JSDoc type annotations.

---

### 8.2 — No Unit Tests

Core business logic (`updateStreak`, `computeStreak`, `useProgress` calculations) is completely untested.

**Fix:** Add Vitest (zero-config with Vite):
```bash
npm install -D vitest @testing-library/react
```

---

### 8.3 — No ESLint Configuration

No `.eslintrc`. The duplicate import in `Layout.jsx` and any hooks rule violations go undetected.

**Fix:** `npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks`

---

### 8.4 — No Prettier Configuration

Code style is inconsistent. `StudyPlan.jsx` has everything on single lines, making it very difficult to read or diff.

**Fix:** Add `.prettierrc` and run `npx prettier --write src/` once.

---

### 8.5 — `README.md` Has Wrong Live URL

README links to `https://cca-prep-sable.vercel.app` but the live app is at `https://claude-exam-prep-jet.vercel.app`.

---

## 9. Feature Gaps

| Feature | Priority | Effort | Notes |
|---|---|---|---|
| Data import from JSON | High | Low | exportData exists but no import |
| Pause quiz | High | Low | Needed on mobile |
| Keyboard shortcuts in quiz | High | Low | 5 lines of code |
| Question text in results review | High | Low | UX critical for learning |
| More quiz questions (60+) | High | Medium | 22 is far too few |
| Confetti on week completion | Medium | Low | Motivational |
| Dark/light mode toggle | Medium | Medium | Currently dark-only |
| Notes per week / task | Medium | High | User annotations |
| Anki card export | Medium | Medium | Referenced in tasks, not implemented |
| Pomodoro/study timer | Low | Medium | Natural fit for study app |
| Cloud sync | Low | High | Requires backend |

---

## 10. Priority Summary

### 🔴 Fix Immediately (Bugs / Wrong Data)
1. **Stale default exam date** — `2026-05-30` is in the past
2. **Wrong Onboarding stats** — shows `13+` questions; actual is 22
3. **Missing PWA icons** — `pwa-192x192.png` / `pwa-512x512.png` don't exist in `public/`
4. **Missing data import** — README promises it; it's not implemented
5. **Duplicate import** in `Layout.jsx`

### 🟠 High Impact, Low Effort
6. Extract exam date to a single constant
7. Keyboard shortcuts in `QuizActive.jsx`
8. ARIA labels on icon buttons and progress bars
9. Question text in quiz results review panel
10. DST-safe streak calculation

### 🟡 Medium Term
11. Code splitting with `React.lazy`
12. Split `data.js` into three modules
13. ESLint + Prettier setup
14. Vitest unit tests for storage and useProgress
15. Quiz pause functionality
16. Expand quiz to 60+ questions

### 🟢 Nice to Have
17. TypeScript migration or JSDoc types
18. Toast notifications for week completion
19. CSP headers via `vercel.json`
20. Manual Rollup chunks for better caching

---

*Generated by Antigravity code analysis — June 2026*
