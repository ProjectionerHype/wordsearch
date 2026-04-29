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
const HISTORY_KEY = "wordsearch-daily-history";
const LONGEST_KEY = "wordsearch-daily-longest-streak";

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

function getCompletedHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((d): d is string => typeof d === "string");
    return [];
  } catch {
    return [];
  }
}

function saveCompletedHistory(history: string[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function saveDailyResult(result: DailyResult): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    const history = getCompletedHistory();
    if (!history.includes(result.dateKey)) {
      history.push(result.dateKey);
      saveCompletedHistory(history);
    }
    const streak = getCurrentStreak();
    const longestRaw = localStorage.getItem(LONGEST_KEY);
    const longest = longestRaw ? parseInt(longestRaw, 10) || 0 : 0;
    if (streak > longest) {
      localStorage.setItem(LONGEST_KEY, streak.toString());
    }
  } catch {
    // ignore
  }
}

function utcMidnightToKey(utcMs: number): string {
  const d = new Date(utcMs);
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export interface StreakInfo {
  current: number;
  longest: number;
  includesToday: boolean;
}

export function getStreakInfo(now: Date = new Date()): StreakInfo {
  const history = getCompletedHistory();
  const set = new Set(history);
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const todayKey = utcMidnightToKey(todayUTC);

  let cursor = todayUTC;
  let includesToday = false;
  if (set.has(todayKey)) {
    includesToday = true;
  } else {
    // streak is still alive if yesterday was completed (today is not yet missed)
    cursor = todayUTC - 86400000;
    if (!set.has(utcMidnightToKey(cursor))) {
      const longestRaw = localStorage.getItem(LONGEST_KEY);
      const longest = longestRaw ? parseInt(longestRaw, 10) || 0 : 0;
      return { current: 0, longest, includesToday: false };
    }
  }

  let current = 0;
  while (set.has(utcMidnightToKey(cursor))) {
    current++;
    cursor -= 86400000;
  }

  const longestRaw = localStorage.getItem(LONGEST_KEY);
  const storedLongest = longestRaw ? parseInt(longestRaw, 10) || 0 : 0;
  const longest = Math.max(storedLongest, current);

  return { current, longest, includesToday };
}

function getCurrentStreak(now: Date = new Date()): number {
  return getStreakInfo(now).current;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function buildShareText(result: DailyResult): string {
  const time = formatTime(result.timeElapsed);
  const hints = result.hintsUsed === 0 ? "no hints" : `${result.hintsUsed} hint${result.hintsUsed === 1 ? "" : "s"}`;
  const url = typeof window !== "undefined" ? window.location.origin : "https://dailywordsearch.fun";
  return `Daily Word Search #${result.dayNumber} — ${result.theme}\n⏱ ${time} • 💡 ${hints}\nPlay free: ${url}`;
}
