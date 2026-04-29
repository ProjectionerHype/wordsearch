import { useState, useEffect, useCallback, useRef } from "react";
import { generateGrid, GameBoard, PlacedWord } from "../lib/wordSearch";
import { ThemeName, Difficulty } from "../lib/words";
import confetti from "canvas-confetti";

export interface GameState {
  status: "start" | "playing" | "won";
  theme: ThemeName;
  difficulty: Difficulty;
  board: GameBoard | null;
  foundWords: string[];
  timeElapsed: number;
  hintsRemaining: number;
  isPaused: boolean;
  bestTime: number | null;
  hintedCells: { x: number; y: number }[];
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    status: "start",
    theme: "Animals",
    difficulty: "Easy",
    board: null,
    foundWords: [],
    timeElapsed: 0,
    hintsRemaining: 3,
    isPaused: false,
    bestTime: null,
    hintedCells: [],
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
      if (state.foundWords.length === state.board.wordsToFind.length && state.board.wordsToFind.length > 0) {
        setState((s) => {
          const key = `wordsearch-best-${s.theme}-${s.difficulty}`;
          const currentBest = localStorage.getItem(key);
          let newBest = s.timeElapsed;
          if (currentBest) {
            newBest = Math.min(s.timeElapsed, parseInt(currentBest, 10));
          }
          localStorage.setItem(key, newBest.toString());

          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          return { ...s, status: "won", bestTime: newBest };
        });
      }
    }
  }, [state.foundWords, state.board, state.status, state.timeElapsed, state.theme, state.difficulty]);

  // Load best time on start screen change
  useEffect(() => {
    if (state.status === "start") {
      const key = `wordsearch-best-${state.theme}-${state.difficulty}`;
      const best = localStorage.getItem(key);
      setState((s) => ({ ...s, bestTime: best ? parseInt(best, 10) : null }));
    }
  }, [state.status, state.theme, state.difficulty]);

  const startGame = useCallback((theme: ThemeName, difficulty: Difficulty) => {
    const board = generateGrid(theme, difficulty);
    setState((s) => ({
      ...s,
      status: "playing",
      theme,
      difficulty,
      board,
      foundWords: [],
      timeElapsed: 0,
      hintsRemaining: 3,
      isPaused: false,
      hintedCells: [],
    }));
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
        const unfound = s.board.placedWords.filter(pw => !s.foundWords.includes(pw.word));
        if (unfound.length > 0) {
          const target = unfound[Math.floor(Math.random() * unfound.length)];
          return {
            ...s,
            hintsRemaining: s.hintsRemaining - 1,
            hintedCells: [...s.hintedCells, target.cells[0]]
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

  return {
    state,
    setState,
    startGame,
    handleWordFound,
    useHint,
    togglePause,
    returnToMenu,
  };
}
