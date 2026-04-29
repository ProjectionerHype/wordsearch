import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeName, THEME_NAMES, Difficulty, DIFFICULTY_SETTINGS } from "../lib/words";
import { Trophy, HelpCircle, CalendarDays, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DailyChallenge, DailyResult, formatTime } from "../lib/daily";

function Logo() {
  return (
    <div className="font-black text-2xl md:text-[28px] text-foreground tracking-tight lowercase leading-none select-none">
      daily<span className="relative inline-block">
        <span
          aria-hidden
          className="absolute left-[-3px] right-[-3px] top-1/2 h-[11px] md:h-[13px] -translate-y-1/2 bg-accent/60 -rotate-2 rounded-[3px]"
        />
        <span className="relative">word</span>
      </span>search<span className="text-primary">.fun</span>
    </div>
  );
}

interface StartScreenProps {
  onStart: (theme: ThemeName, difficulty: Difficulty) => void;
  onStartDaily: () => void;
  bestTime: number | null;
  currentTheme: ThemeName;
  currentDifficulty: Difficulty;
  daily: DailyChallenge;
  dailyResult: DailyResult | null;
}

export function StartScreen({
  onStart,
  onStartDaily,
  bestTime,
  currentTheme,
  currentDifficulty,
  daily,
  dailyResult,
}: StartScreenProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(currentDifficulty);

  const completedToday = dailyResult !== null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ transform: "none" }}
      className="w-full max-w-md mx-auto p-5 md:p-6 bg-card rounded-3xl shadow-2xl border border-card-border my-auto"
    >
      <div className="flex justify-between items-center mb-5">
        <h1 aria-label="dailywordsearch.fun">
          <Logo />
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors shrink-0"
              aria-label="How to play"
            >
              <HelpCircle className="w-5 h-5" />
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
              <p>6. <strong>Daily Challenge:</strong> Same puzzle for everyone, every day.</p>
              <p>7. Use hints if you get stuck!</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <button
        onClick={onStartDaily}
        disabled={completedToday}
        className={`group w-full mb-4 p-3 rounded-2xl text-left transition-all border ${
          completedToday
            ? "bg-muted border-transparent cursor-default"
            : "bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 border-primary/30 hover:border-primary/60 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${completedToday ? "bg-muted-foreground/10" : "bg-primary text-primary-foreground shadow-sm"}`}>
            {completedToday ? (
              <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
            ) : (
              <CalendarDays className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-foreground">Daily Challenge</span>
              <span className="text-[10px] font-mono font-bold text-muted-foreground">#{daily.dayNumber}</span>
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5 truncate">
              {completedToday ? (
                <>Solved in <span className="font-mono font-bold text-foreground">{formatTime(dailyResult!.timeElapsed)}</span> · Back tomorrow</>
              ) : (
                <>{daily.theme} · {daily.difficulty} · Same puzzle worldwide</>
              )}
            </div>
          </div>
          {!completedToday && (
            <div className="flex items-center gap-1 text-secondary shrink-0">
              <Sparkles className="w-4 h-4" />
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          )}
        </div>
      </button>

      <div className="relative flex items-center my-4">
        <div className="flex-1 h-px bg-border" />
        <span className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Or Pick Your Own</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-black text-foreground/70 uppercase tracking-[0.15em] mb-2 block">Theme</label>
          <div className="grid grid-cols-4 gap-1.5">
            {THEME_NAMES.map(theme => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`py-2 px-1.5 rounded-lg font-bold text-xs transition-all ${
                  selectedTheme === theme 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-black text-foreground/70 uppercase tracking-[0.15em] mb-2 block">Difficulty</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                  selectedDifficulty === diff 
                    ? "bg-secondary text-secondary-foreground shadow-md" 
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {bestTime !== null && (
          <div className="flex items-center gap-2 text-accent-foreground bg-accent/20 px-3 py-2 rounded-lg text-xs font-bold">
            <Trophy className="w-4 h-4 text-accent shrink-0" />
            <span className="truncate">Best for {selectedTheme} ({selectedDifficulty}): <span className="font-mono">{formatTime(bestTime)}</span></span>
          </div>
        )}

        <button
          onClick={() => onStart(selectedTheme, selectedDifficulty)}
          className="w-full py-3.5 rounded-2xl bg-foreground text-background font-black text-base tracking-wider uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0"
        >
          Start Game
        </button>
      </div>
    </motion.div>
  );
}
