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

export function generateGrid(theme: ThemeName, difficulty: Difficulty): GameBoard {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const size = settings.size;
  const wordList = THEMES[theme];
  
  // Pick random words from the theme
  const shuffledWords = [...wordList].sort(() => Math.random() - 0.5).slice(0, settings.wordsCount);
  
  // Initialize empty grid
  const grid: Cell[][] = Array(size).fill(null).map((_, y) => 
    Array(size).fill(null).map((_, x) => ({ x, y, letter: "" }))
  );
  
  const placedWords: PlacedWord[] = [];
  let colorCounter = 0;
  
  for (const word of shuffledWords) {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 100) {
      attempts++;
      const dir = settings.directions[Math.floor(Math.random() * settings.directions.length)];
      const startX = Math.floor(Math.random() * size);
      const startY = Math.floor(Math.random() * size);
      
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
        grid[y][x].letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
    }
  }
  
  return { grid, placedWords, size, wordsToFind: shuffledWords };
}
