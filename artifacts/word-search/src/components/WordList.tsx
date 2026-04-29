import { motion } from "framer-motion";
import { GameBoard } from "../lib/wordSearch";

interface WordListProps {
  board: GameBoard;
  foundWords: string[];
}

export function WordList({ board, foundWords }: WordListProps) {
  return (
    <div className="bg-card rounded-2xl shadow-xl p-4 md:p-5 border border-card-border md:h-full md:flex md:flex-col md:min-h-0">
      <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-foreground/80 uppercase tracking-wider shrink-0">Words to Find</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-x-3 gap-y-2 md:overflow-y-auto md:flex-1 md:min-h-0 pr-1">
        {board.wordsToFind.map((word) => {
          const isFound = foundWords.includes(word);
          const placedWord = board.placedWords.find(pw => pw.word === word);
          const colorClass = placedWord ? `highlight-${placedWord.colorIndex}` : "bg-primary";
          
          return (
            <motion.div 
              key={word}
              animate={{ opacity: isFound ? 0.6 : 1 }}
              className="flex items-center"
            >
              <span className={`relative inline-block font-mono text-sm md:text-base font-bold transition-colors duration-300 ${isFound ? 'text-muted-foreground' : 'text-foreground'}`}>
                {word}
                {isFound && (
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full opacity-80 pointer-events-none ${colorClass}`}
                  />
                )}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
