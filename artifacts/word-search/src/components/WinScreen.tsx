import { motion } from "framer-motion";
import { ThemeName, Difficulty } from "../lib/words";
import { Trophy, Clock, Target, ArrowRight, RotateCcw } from "lucide-react";

interface WinScreenProps {
  timeElapsed: number;
  bestTime: number | null;
  theme: ThemeName;
  difficulty: Difficulty;
  wordsFound: number;
  onPlayAgain: () => void;
  onChangeTheme: () => void;
}

export function WinScreen({ timeElapsed, bestTime, theme, difficulty, wordsFound, onPlayAgain, onChangeTheme }: WinScreenProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isNewBest = bestTime === timeElapsed;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto p-8 bg-card rounded-3xl shadow-2xl border border-card-border text-center relative overflow-hidden"
    >
      {isNewBest && (
        <div className="absolute top-4 right-[-30px] bg-accent text-accent-foreground font-black py-1 px-10 rotate-45 shadow-sm text-xs">
          NEW BEST!
        </div>
      )}

      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Trophy className="w-10 h-10 text-primary" />
      </motion.div>

      <h2 className="text-3xl font-black mb-2 text-foreground">You Won!</h2>
      <p className="text-muted-foreground font-medium mb-8">
        You found all {wordsFound} words in {theme} ({difficulty}).
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-muted rounded-2xl p-4 flex flex-col items-center">
          <Clock className="w-6 h-6 text-muted-foreground mb-2" />
          <span className="text-2xl font-mono font-black text-foreground">{formatTime(timeElapsed)}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">Time</span>
        </div>
        <div className="bg-muted rounded-2xl p-4 flex flex-col items-center">
          <Target className="w-6 h-6 text-muted-foreground mb-2" />
          <span className="text-2xl font-mono font-black text-foreground">{bestTime ? formatTime(bestTime) : "--:--"}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase">Best</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onPlayAgain}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Play Again
        </button>
        <button
          onClick={onChangeTheme}
          className="w-full py-4 rounded-2xl bg-secondary/10 text-secondary font-black text-lg hover:bg-secondary/20 transition-all flex items-center justify-center gap-2"
        >
          Menu <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
