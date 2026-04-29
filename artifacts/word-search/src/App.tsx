import { useGameState } from "./hooks/useGameState";
import { StartScreen } from "./components/StartScreen";
import { GameGrid } from "./components/GameGrid";
import { WordList } from "./components/WordList";
import { TopBar } from "./components/TopBar";
import { WinScreen } from "./components/WinScreen";
import { motion, AnimatePresence } from "framer-motion";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

function GameApp() {
  const { state, startGame, handleWordFound, useHint, togglePause, returnToMenu } = useGameState();

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col pt-8 md:pt-12 px-4 pb-8 overflow-x-hidden relative">
      {/* Background decorations */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {state.status === "start" && (
            <motion.div key="start" className="flex-1 flex items-center justify-center">
              <StartScreen 
                onStart={startGame} 
                bestTime={state.bestTime} 
                currentTheme={state.theme}
                currentDifficulty={state.difficulty}
              />
            </motion.div>
          )}

          {(state.status === "playing" || state.status === "won") && state.board && (
            <motion.div 
              key="game" 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col"
            >
              <TopBar 
                timeElapsed={state.timeElapsed}
                hintsRemaining={state.hintsRemaining}
                isPaused={state.isPaused}
                onPauseToggle={togglePause}
                onHint={useHint}
                onNewGame={() => startGame(state.theme, state.difficulty)}
                onBackToMenu={returnToMenu}
              />

              <div className="flex flex-col md:flex-row gap-6 md:gap-8 flex-1 min-h-0">
                <div className="flex-1 flex items-center justify-center order-1 md:order-1">
                  <GameGrid 
                    board={state.board}
                    foundWords={state.foundWords}
                    onWordFound={handleWordFound}
                    isPaused={state.isPaused || state.status === "won"}
                    hintedCells={state.hintedCells}
                  />
                </div>
                
                <div className="w-full md:w-64 lg:w-80 flex flex-col order-2 md:order-2">
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
                onPlayAgain={() => startGame(state.theme, state.difficulty)}
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
            <Route path="/*" component={GameApp} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
