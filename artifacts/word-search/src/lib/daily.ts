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

export function buildShareText(result: DailyResult): string {
  const time = formatTime(result.timeElapsed);
  const hints = result.hintsUsed === 0 ? "no hints" : `${result.hintsUsed} hint${result.hintsUsed === 1 ? "" : "s"}`;
  return `Word Search Daily #${result.dayNumber} — ${result.theme}\n⏱ ${time} • 💡 ${hints}\nPlay free: ${typeof window !== "undefined" ? window.location.origin : ""}`;
}
