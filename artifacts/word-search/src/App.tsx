import { useGameState } from "./hooks/useGameState";
import { StartScreen } from "./components/StartScreen";
import { GameGrid } from "./components/GameGrid";
import { WordList } from "./components/WordList";
import { TopBar } from "./components/TopBar";
import { WinScreen } from "./components/WinScreen";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import { motion, AnimatePresence } from "framer-motion";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

function GameApp() {
  const { state, startGame, startDailyChallenge, handleWordFound, useHint, togglePause, returnToMenu, playAgain } = useGameState();

  return (
    <div className="min-h-[100dvh] md:h-[100dvh] w-full bg-background flex flex-col pt-4 md:pt-3 px-4 pb-4 md:pb-3 overflow-x-hidden md:overflow-hidden relative">

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col relative z-10 min-h-0">
        <AnimatePresence mode="wait">
          {state.status === "start" && (
            <motion.div key="start" className="flex-1 flex items-center justify-center overflow-y-auto py-4 md:py-2">
              <StartScreen 
                onStart={startGame}
                onStartDaily={startDailyChallenge}
                bestTime={state.bestTime} 
                currentTheme={state.theme}
                currentDifficulty={state.difficulty}
                daily={state.daily}
                dailyResult={state.dailyResult}
                streak={state.streak}
              />
            </motion.div>
          )}

          {(state.status === "playing" || state.status === "won") && state.board && (
            <motion.div 
              key="game" 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <TopBar 
                timeElapsed={state.timeElapsed}
                hintsRemaining={state.hintsRemaining}
                isPaused={state.isPaused}
                isDaily={state.mode === "daily"}
                dailyDayNumber={state.daily.dayNumber}
                onPauseToggle={togglePause}
                onHint={useHint}
                onNewGame={state.mode === "daily" ? returnToMenu : () => startGame(state.theme, state.difficulty)}
                onBackToMenu={returnToMenu}
              />

              <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1 min-h-0">
                <div className="flex-1 flex items-center justify-center order-1 md:order-1 min-h-0 min-w-0">
                  <GameGrid 
                    board={state.board}
                    foundWords={state.foundWords}
                    onWordFound={handleWordFound}
                    isPaused={state.isPaused || state.status === "won"}
                    hintedCells={state.hintedCells}
                  />
                </div>
                
                <div className="w-full md:w-64 lg:w-72 flex flex-col order-2 md:order-2 md:h-full md:min-h-0">
                  <WordList 
                    board={state.board}
                    foundWords={state.foundWords}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.status === "won" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <WinScreen
                timeElapsed={state.timeElapsed}
                bestTime={state.bestTime}
                theme={state.theme}
                difficulty={state.difficulty}
                wordsFound={state.foundWords.length}
                mode={state.mode}
                dailyResult={state.dailyResult}
                onPlayAgain={playAgain}
                onChangeTheme={returnToMenu}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={GameApp} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/about" component={About} />
            <Route path="/*" component={GameApp} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
