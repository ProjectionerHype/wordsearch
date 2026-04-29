import { Pause, Play, Lightbulb, RotateCcw, ArrowLeft } from "lucide-react";

interface TopBarProps {
  timeElapsed: number;
  hintsRemaining: number;
  isPaused: boolean;
  onPauseToggle: () => void;
  onHint: () => void;
  onNewGame: () => void;
  onBackToMenu: () => void;
}

export function TopBar({ timeElapsed, hintsRemaining, isPaused, onPauseToggle, onHint, onNewGame, onBackToMenu }: TopBarProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-between bg-card p-3 md:p-4 rounded-2xl shadow-sm border border-card-border mb-4 shrink-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={onBackToMenu}
          className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
          title="Back to Menu"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="font-mono font-black text-xl text-foreground w-16">
          {formatTime(timeElapsed)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onHint}
          disabled={hintsRemaining === 0 || isPaused}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/20 text-accent-foreground font-bold hover:bg-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          <span className="hidden sm:inline">Hint</span>
          <span className="bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">{hintsRemaining}</span>
        </button>
        
        <button
          onClick={onPauseToggle}
          className="p-2 px-3 rounded-xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors flex items-center gap-1.5"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span className="hidden sm:inline">{isPaused ? "Resume" : "Pause"}</span>
        </button>

        <button
          onClick={onNewGame}
          className="p-2 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
          title="Restart Game"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
