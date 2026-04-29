import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameBoard, Cell } from "../lib/wordSearch";

interface GameGridProps {
  board: GameBoard;
  foundWords: string[];
  onWordFound: (word: string) => void;
  isPaused: boolean;
  hintedCells: { x: number; y: number }[];
}

interface Point {
  x: number;
  y: number;
}

function computePillGeometry(start: Point, end: Point, size: number): React.CSSProperties {
  const cellPct = 100 / size;
  const sx = (start.x + 0.5) * cellPct;
  const sy = (start.y + 0.5) * cellPct;
  const ex = (end.x + 0.5) * cellPct;
  const ey = (end.y + 0.5) * cellPct;
  const midX = (sx + ex) / 2;
  const midY = (sy + ey) / 2;
  const dx = ex - sx;
  const dy = ey - sy;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const thickness = cellPct * 0.78;
  const length = distance + thickness;

  return {
    position: "absolute",
    left: `${midX}%`,
    top: `${midY}%`,
    width: `${length}%`,
    height: `${thickness}%`,
    marginLeft: `${-length / 2}%`,
    marginTop: `${-thickness / 2}%`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: "center center",
  };
}

export function GameGrid({ board, foundWords, onWordFound, isPaused, hintedCells }: GameGridProps) {
  const [startCell, setStartCell] = useState<Point | null>(null);
  const [currentCell, setCurrentCell] = useState<Point | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Found word highlights
  const foundHighlights = board.placedWords.filter((pw) => foundWords.includes(pw.word));

  const getCellFromEvent = (e: React.PointerEvent | PointerEvent): Point | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    
    const cellWidth = rect.width / board.size;
    const cellHeight = rect.height / board.size;
    
    const x = Math.floor(xPos / cellWidth);
    const y = Math.floor(yPos / cellHeight);
    
    if (x >= 0 && x < board.size && y >= 0 && y < board.size) {
      return { x, y };
    }
    return null;
  };

  const isValidDirection = (start: Point, end: Point) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (dx === 0 && dy === 0) return true;
    if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) return true;
    return false;
  };

  const getLineCells = (start: Point, end: Point): Point[] => {
    if (!isValidDirection(start, end)) return [start];
    
    const dx = Math.sign(end.x - start.x);
    const dy = Math.sign(end.y - start.y);
    const length = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y));
    
    const cells = [];
    for (let i = 0; i <= length; i++) {
      cells.push({ x: start.x + dx * i, y: start.y + dy * i });
    }
    return cells;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPaused) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    const cell = getCellFromEvent(e);
    if (cell) {
      setStartCell(cell);
      setCurrentCell(cell);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPaused || !startCell) return;
    const cell = getCellFromEvent(e);
    if (cell && isValidDirection(startCell, cell)) {
      setCurrentCell(cell);
    }
  };

  const handlePointerUp = () => {
    if (!startCell || !currentCell || isPaused) {
      setStartCell(null);
      setCurrentCell(null);
      return;
    }

    const cells = getLineCells(startCell, currentCell);
    const wordForward = cells.map(c => board.grid[c.y][c.x].letter).join("");
    const wordBackward = wordForward.split("").reverse().join("");

    if (board.wordsToFind.includes(wordForward)) {
      onWordFound(wordForward);
    } else if (board.wordsToFind.includes(wordBackward)) {
      onWordFound(wordBackward);
    }

    setStartCell(null);
    setCurrentCell(null);
  };

  // Add global pointer up to catch releases outside
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      handlePointerUp();
    };
    window.addEventListener("pointerup", handleGlobalPointerUp);
    return () => window.removeEventListener("pointerup", handleGlobalPointerUp);
  }, [startCell, currentCell, isPaused]);

  const activeSelectionCells = startCell && currentCell ? getLineCells(startCell, currentCell) : [];

  return (
    <div 
      className="relative aspect-square w-full max-w-[500px] md:w-auto md:h-full md:max-h-full md:max-w-full mx-auto bg-card rounded-2xl shadow-xl overflow-hidden border border-card-border p-2 select-none touch-none"
      style={{ touchAction: 'none' }}
    >
      <div 
        ref={gridRef}
        className="w-full h-full grid relative"
        style={{ 
          gridTemplateColumns: `repeat(${board.size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${board.size}, minmax(0, 1fr))`
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        {/* Render Highlights */}
        {foundHighlights.map((pw) => {
          const start = pw.cells[0];
          const end = pw.cells[pw.cells.length - 1];
          const geom = computePillGeometry(start, end, board.size);

          return (
            <div
              key={`highlight-${pw.word}`}
              className="pointer-events-none"
              style={geom}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                className={`w-full h-full rounded-full highlight-${pw.colorIndex}`}
              />
            </div>
          );
        })}

        {/* Render Current Selection */}
        {startCell && currentCell && (
          <div
            className="absolute rounded-full bg-primary/30 pointer-events-none"
            style={computePillGeometry(startCell, currentCell, board.size)}
          />
        )}

        {/* Render Letters */}
        {board.grid.map((row, y) => 
          row.map((cell, x) => {
            const isSelected = activeSelectionCells.some(c => c.x === x && c.y === y);
            const isFound = foundHighlights.some(pw => pw.cells.some(c => c.x === x && c.y === y));
            const isHinted = hintedCells.some(c => c.x === x && c.y === y);
            
            return (
              <div 
                key={`${x}-${y}`} 
                className="flex items-center justify-center relative pointer-events-none"
              >
                <motion.span 
                  animate={{ 
                    scale: isSelected ? 1.2 : 1,
                    color: isSelected ? 'hsl(var(--primary))' : isFound ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))',
                    fontWeight: isSelected || isFound ? 800 : 600
                  }}
                  className="z-10 text-sm md:text-xl md:text-2xl font-sans"
                >
                  {cell.letter}
                </motion.span>
                
                {isHinted && !isFound && (
                  <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-1 border-2 border-accent rounded-md"
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {isPaused && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <span className="text-3xl font-bold text-foreground tracking-widest">PAUSED</span>
        </div>
      )}
    </div>
  );
}
