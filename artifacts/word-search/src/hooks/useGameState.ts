import { useState, useEffect, useCallback, useRef } from "react";
import { generateGrid, GameBoard } from "../lib/wordSearch";
import { ThemeName, Difficulty } from "../lib/words";
import {
  DailyChallenge,
  getDailyChallenge,
  getStoredDailyResult,
  saveDailyResult,
  getStreakInfo,
  StreakInfo,
  DailyResult,
} from "../lib/daily";
import confetti from "canvas-confetti";

export type GameMode = "regular" | "daily";

export interface GameState {
  status: "start" | "playing" | "won";
  mode: GameMode;
  theme: ThemeName;
  difficulty: Difficulty;
  board: GameBoard | null;
  foundWords: string[];
  timeElapsed: number;
  hintsRemaining: number;
  hintsUsed: number;
  isPaused: boolean;
  bestTime: number | null;
  hintedCells: { x: number; y: number }[];
  daily: DailyChallenge;
  dailyResult: DailyResult | null;
  streak: StreakInfo;
}

const MAX_HINTS = 3;

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const daily = getDailyChallenge();
    return {
      status: "start",
      mode: "regular",
      theme: "Mix",
      difficulty: "Easy",
      board: null,
      foundWords: [],
      timeElapsed: 0,
      hintsRemaining: MAX_HINTS,
      hintsUsed: 0,
      isPaused: false,
      bestTime: null,
      hintedCells: [],
      daily,
      dailyResult: getStoredDailyResult(daily.dateKey),
      streak: getStreakInfo(),
    };
  });

  const timerRef = useRef<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (state.status === "playing" && !state.isPaused) {
      timerRef.current = window.setInterval(() => {
        setState((s) => ({ ...s, timeElapsed: s.timeElapsed + 1 }));
      }, 1000);
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, [state.status, state.isPaused]);

  // Check win condition
  useEffect(() => {
    if (state.status === "playing" && state.board) {
      if (
        state.foundWords.length === state.board.wordsToFind.length &&
        state.board.wordsToFind.length > 0
      ) {
        setState((s) => {
          let newBest = s.bestTime;
          let dailyResult = s.dailyResult;

          if (s.mode === "regular") {
            const key = `wordsearch-best-${s.theme}-${s.difficulty}`;
            const currentBest = localStorage.getItem(key);
            newBest = s.timeElapsed;
            if (currentBest) {
              newBest = Math.min(s.timeElapsed, parseInt(currentBest, 10));
            }
            localStorage.setItem(key, newBest.toString());
          } else {
            const result: DailyResult = {
              dateKey: s.daily.dateKey,
              timeElapsed: s.timeElapsed,
              hintsUsed: s.hintsUsed,
              theme: s.theme,
              difficulty: s.difficulty,
              dayNumber: s.daily.dayNumber,
            };
            saveDailyResult(result);
            dailyResult = result;
            newBest = s.timeElapsed;
          }

          const updatedStreak = s.mode === "daily" ? getStreakInfo() : s.streak;

          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });

          return { ...s, status: "won", bestTime: newBest, dailyResult, streak: updatedStreak };
        });
      }
    }
  }, [state.foundWords, state.board, state.status]);

  // Load best time on start screen change
  useEffect(() => {
    if (state.status === "start" && state.mode === "regular") {
      const key = `wordsearch-best-${state.theme}-${state.difficulty}`;
      const best = localStorage.getItem(key);
      setState((s) => ({ ...s, bestTime: best ? parseInt(best, 10) : null }));
    }
  }, [state.status, state.theme, state.difficulty, state.mode]);

  const startGame = useCallback((theme: ThemeName, difficulty: Difficulty) => {
    const board = generateGrid(theme, difficulty);
    setState((s) => ({
      ...s,
      status: "playing",
      mode: "regular",
      theme,
      difficulty,
      board,
      foundWords: [],
      timeElapsed: 0,
      hintsRemaining: MAX_HINTS,
      hintsUsed: 0,
      isPaused: false,
      hintedCells: [],
    }));
  }, []);

  const startDailyChallenge = useCallback(() => {
    setState((s) => {
      const board = generateGrid(s.daily.theme, s.daily.difficulty, s.daily.seed);
      return {
        ...s,
        status: "playing",
        mode: "daily",
        theme: s.daily.theme,
        difficulty: s.daily.difficulty,
        board,
        foundWords: [],
        timeElapsed: 0,
        hintsRemaining: MAX_HINTS,
        hintsUsed: 0,
        isPaused: false,
        hintedCells: [],
      };
    });
  }, []);

  const handleWordFound = useCallback((word: string) => {
    setState((s) => {
      if (!s.foundWords.includes(word) && s.board?.wordsToFind.includes(word)) {
        return { ...s, foundWords: [...s.foundWords, word] };
      }
      return s;
    });
  }, []);

  const useHint = useCallback(() => {
    setState((s) => {
      if (s.hintsRemaining > 0 && s.board) {
        const unfound = s.board.placedWords.filter(
          (pw) => !s.foundWords.includes(pw.word),
        );
        if (unfound.length > 0) {
          const target = unfound[Math.floor(Math.random() * unfound.length)];
          return {
            ...s,
            hintsRemaining: s.hintsRemaining - 1,
            hintsUsed: s.hintsUsed + 1,
            hintedCells: [...s.hintedCells, target.cells[0]],
          };
        }
      }
      return s;
    });
  }, []);

  const togglePause = useCallback(() => {
    setState((s) => ({ ...s, isPaused: !s.isPaused }));
  }, []);

  const returnToMenu = useCallback(() => {
    setState((s) => ({ ...s, status: "start" }));
  }, []);

  const playAgain = useCallback(() => {
    setState((s) => {
      if (s.mode === "daily") {
        // Daily can't be replayed for a new score; just return to menu.
        return { ...s, status: "start" };
      }
      const board = generateGrid(s.theme, s.difficulty);
      return {
        ...s,
        status: "playing",
        board,
        foundWords: [],
        timeElapsed: 0,
        hintsRemaining: MAX_HINTS,
        hintsUsed: 0,
        isPaused: false,
        hintedCells: [],
      };
    });
  }, []);

  return {
    state,
    setState,
    startGame,
    startDailyChallenge,
    handleWordFound,
    useHint,
    togglePause,
    returnToMenu,
    playAgain,
  };
}
