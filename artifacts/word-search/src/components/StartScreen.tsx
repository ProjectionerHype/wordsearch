import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeName, THEME_NAMES, Difficulty, DIFFICULTY_SETTINGS } from "../lib/words";
import { Trophy, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface StartScreenProps {
  onStart: (theme: ThemeName, difficulty: Difficulty) => void;
  bestTime: number | null;
  currentTheme: ThemeName;
  currentDifficulty: Difficulty;
}

export function StartScreen({ onStart, bestTime, currentTheme, currentDifficulty }: StartScreenProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(currentDifficulty);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-lg mx-auto p-6 md:p-8 bg-card rounded-3xl shadow-2xl border border-card-border"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">Word Search</h1>
          <p className="text-muted-foreground mt-2 font-medium">Find the hidden words.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
              <HelpCircle className="w-6 h-6" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to Play</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-muted-foreground mt-4">
              <p>1. Find all the hidden words in the grid based on the selected theme.</p>
              <p>2. Drag across the letters to select a word. Words can be forwards or backwards.</p>
              <p>3. <strong>Easy:</strong> Horizontal and Vertical only.</p>
              <p>4. <strong>Medium:</strong> Adds forward Diagonals.</p>
              <p>5. <strong>Hard:</strong> All 8 directions, including backwards.</p>
              <p>6. Use hints if you get stuck!</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 block">Select Theme</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {THEME_NAMES.map(theme => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`py-2 px-3 rounded-xl font-bold text-sm transition-all ${
                  selectedTheme === theme 
                    ? "bg-primary text-primary-foreground shadow-md scale-105" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 block">Difficulty</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`py-2 px-3 rounded-xl font-bold text-sm transition-all ${
                  selectedDifficulty === diff 
                    ? "bg-secondary text-secondary-foreground shadow-md scale-105" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {bestTime !== null && (
          <div className="flex items-center gap-2 text-accent-foreground bg-accent/20 px-4 py-3 rounded-xl font-mono font-bold">
            <Trophy className="w-5 h-5 text-accent" />
            <span>Best time for {selectedTheme} ({selectedDifficulty}): {formatTime(bestTime)}</span>
          </div>
        )}

        <button
          onClick={() => onStart(selectedTheme, selectedDifficulty)}
          className="w-full py-4 rounded-2xl bg-foreground text-background font-black text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:translate-y-0"
        >
          START GAME
        </button>
      </div>
    </motion.div>
  );
}
