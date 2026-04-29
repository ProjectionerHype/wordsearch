import { THEME_NAMES, ThemeName, Difficulty } from "./words";

export interface DailyChallenge {
  dateKey: string;
  seed: number;
  theme: ThemeName;
  difficulty: Difficulty;
  dayNumber: number;
}

const EPOCH = Date.UTC(2026, 0, 1);

export function getTodayDateKey(now: Date = new Date()): string {
  const y = now.getUTCFullYear();
  const m = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const d = now.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDailyChallenge(now: Date = new Date()): DailyChallenge {
  const dateKey = getTodayDateKey(now);
  const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dayNumber = Math.max(1, Math.floor((utcMidnight - EPOCH) / 86400000) + 1);

  let h = 0x811c9dc5;
  for (let i = 0; i < dateKey.length; i++) {
    h ^= dateKey.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const seed = h >>> 0;
  const theme = THEME_NAMES[seed % THEME_NAMES.length];
  const difficulty: Difficulty = "Medium";

  return { dateKey, seed, theme, difficulty, dayNumber };
}

export interface DailyResult {
  dateKey: string;
  timeElapsed: number;
  hintsUsed: number;
  theme: ThemeName;
  difficulty: Difficulty;
  dayNumber: number;
}

const STORAGE_KEY = "wordsearch-daily-result";

export function getStoredDailyResult(dateKey: string): DailyResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyResult;
    if (parsed.dateKey === dateKey) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveDailyResult(result: DailyResult): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // ignore
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export interface StreakInfo {
  count: number;
  lastDayNumber: number;
}

const STREAK_KEY = "wordsearch-streak";

export function getStreak(): StreakInfo {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { count: 0, lastDayNumber: 0 };
    const parsed = JSON.parse(raw) as StreakInfo;
    return { count: parsed.count ?? 0, lastDayNumber: parsed.lastDayNumber ?? 0 };
  } catch {
    return { count: 0, lastDayNumber: 0 };
  }
}

export function getEffectiveStreak(today: DailyChallenge): number {
  const s = getStreak();
  if (s.count === 0) return 0;
  // Streak is current if last completion was today or yesterday
  if (s.lastDayNumber === today.dayNumber || s.lastDayNumber === today.dayNumber - 1) {
    return s.count;
  }
  return 0;
}

export function recordStreakForCompletion(dayNumber: number): number {
  const s = getStreak();
  let next: StreakInfo;
  if (s.lastDayNumber === dayNumber) {
    next = s; // already counted today
  } else if (s.lastDayNumber === dayNumber - 1) {
    next = { count: s.count + 1, lastDayNumber: dayNumber };
  } else {
    next = { count: 1, lastDayNumber: dayNumber };
  }
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next.count;
}

export function getMillisUntilNextPuzzle(now: Date = new Date()): number {
  const next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
    0,
  );
  return Math.max(0, next - now.getTime());
}

export function formatCountdown(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

export function buildShareText(result: DailyResult): string {
  const time = formatTime(result.timeElapsed);
  const hints = result.hintsUsed === 0 ? "no hints" : `${result.hintsUsed} hint${result.hintsUsed === 1 ? "" : "s"}`;
  const url = typeof window !== "undefined" ? window.location.origin : "https://dailywordsearch.fun";
  return `Daily Word Search #${result.dayNumber} — ${result.theme}\n⏱ ${time} • 💡 ${hints}\nPlay free: ${url}`;
}
