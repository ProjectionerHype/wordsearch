import { THEMES, ThemeName, Difficulty, DIFFICULTY_SETTINGS } from "./words";

export interface Cell {
  x: number;
  y: number;
  letter: string;
}

export interface PlacedWord {
  word: string;
  cells: { x: number; y: number }[];
  colorIndex: number;
}

export interface GameBoard {
  grid: Cell[][];
  placedWords: PlacedWord[];
  size: number;
  wordsToFind: string[];
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateGrid(theme: ThemeName, difficulty: Difficulty, seed?: number): GameBoard {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const size = settings.size;
  // Filter out words that can't possibly fit on this grid size, otherwise
  // they'd be in `wordsToFind` but never placed and the player could never win.
  const wordList = THEMES[theme].filter((w) => w.length <= size);
  const rand = seed !== undefined ? mulberry32(seed) : Math.random;

  // Pick random words from the theme (Fisher-Yates with seeded RNG)
  const pool = [...wordList];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const candidateWords = pool.slice(0, settings.wordsCount);
  
  // Initialize empty grid
  const grid: Cell[][] = Array(size).fill(null).map((_, y) => 
    Array(size).fill(null).map((_, x) => ({ x, y, letter: "" }))
  );
  
  const placedWords: PlacedWord[] = [];
  let colorCounter = 0;
  
  for (const word of candidateWords) {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 100) {
      attempts++;
      const dir = settings.directions[Math.floor(rand() * settings.directions.length)];
      const startX = Math.floor(rand() * size);
      const startY = Math.floor(rand() * size);
      
      const endX = startX + dir[0] * (word.length - 1);
      const endY = startY + dir[1] * (word.length - 1);
      
      if (endX >= 0 && endX < size && endY >= 0 && endY < size) {
        let valid = true;
        for (let i = 0; i < word.length; i++) {
          const cx = startX + dir[0] * i;
          const cy = startY + dir[1] * i;
          if (grid[cy][cx].letter !== "" && grid[cy][cx].letter !== word[i]) {
            valid = false;
            break;
          }
        }
        
        if (valid) {
          const cells = [];
          for (let i = 0; i < word.length; i++) {
            const cx = startX + dir[0] * i;
            const cy = startY + dir[1] * i;
            grid[cy][cx].letter = word[i];
            cells.push({ x: cx, y: cy });
          }
          placedWords.push({ word, cells, colorIndex: colorCounter % 12 });
          colorCounter++;
          placed = true;
        }
      }
    }
  }
  
  // Fill remaining cells
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y][x].letter === "") {
        grid[y][x].letter = LETTERS[Math.floor(rand() * LETTERS.length)];
      }
    }
  }
  
  // Only require the player to find words we actually managed to place,
  // so a rare placement failure never makes the puzzle unwinnable.
  const wordsToFind = placedWords.map((pw) => pw.word);
  return { grid, placedWords, size, wordsToFind };
}
