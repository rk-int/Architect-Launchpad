// App-wide constants — single source of truth

/**
 * Returns a default exam date 3 weeks from today (ISO string: "YYYY-MM-DD").
 * Used as the initial value for the exam date picker in Onboarding + Settings.
 */
export function getDefaultExamDate() {
  const d = new Date()
  d.setDate(d.getDate() + 21)
  return d.toISOString().slice(0, 10)
}

export const APP_VERSION = '3.0.0'
export const APP_NAME = 'Anthropic Claude LaunchPad'
export const APP_SUBTITLE = 'Featuring Claude Learning & Resources'
export const QUIZ_HISTORY_CAP = 100

/**
 * Timezone-safe week duration calculation.
 * Parses both startedAt and examDate as local dates (ignoring time/UTC shifts)
 * and returns the exact number of calendar weeks.
 */
export function getWeeksDurationSafe(startedAt, examDate) {
  if (!examDate) return 3;

  const toLocalYYYYMMDD = (input) => {
    const d = new Date(input);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const r = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${r}`;
  };

  const startStr = startedAt ? toLocalYYYYMMDD(startedAt) : toLocalYYYYMMDD(new Date());
  const endStr = examDate.includes('T') ? toLocalYYYYMMDD(examDate) : examDate.slice(0, 10);

  const start = new Date(startStr + 'T00:00:00');
  const end = new Date(endStr + 'T00:00:00');

  const diffMs = end - start;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
}

