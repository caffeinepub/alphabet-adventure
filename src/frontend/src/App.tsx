import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import AlphabetScreen from "./components/AlphabetScreen";
import Confetti from "./components/Confetti";
import HomeScreen from "./components/HomeScreen";
import MiniGamesScreen from "./components/MiniGamesScreen";
import ParentDashboard from "./components/ParentDashboard";
import RewardsScreen from "./components/RewardsScreen";
import SentenceBuilderScreen from "./components/SentenceBuilderScreen";
import WordBuilderScreen from "./components/WordBuilderScreen";
import { useAddProgress } from "./hooks/useQueries";
import type { Screen } from "./types";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function AppContent() {
  const [screen, setScreen] = useState<Screen>("home");
  const [localStars, setLocalStars] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const addProgressMutation = useAddProgress();
  const addProgressRef = useRef(addProgressMutation.mutate);
  addProgressRef.current = addProgressMutation.mutate;

  const triggerConfetti = useCallback(() => {
    setConfettiVisible(false);
    setConfettiKey((k) => k + 1);
    setTimeout(() => setConfettiVisible(true), 40);
  }, []);

  const onAwardStars = useCallback(
    async (stars: number, activity: string, level: number): Promise<void> => {
      setLocalStars((prev) => prev + stars);
      triggerConfetti();
      addProgressRef.current({
        activity,
        stars: BigInt(stars),
        level: BigInt(level),
      });
    },
    [triggerConfetti],
  );

  const screenProps = {
    onBack: () => setScreen("home"),
    onNavigate: setScreen,
    onAwardStars,
    triggerConfetti,
    localStars,
  };

  return (
    <div className="min-h-screen">
      {confettiVisible && (
        <Confetti key={confettiKey} onDone={() => setConfettiVisible(false)} />
      )}
      <Toaster />
      {screen === "home" && <HomeScreen {...screenProps} />}
      {screen === "alphabet" && <AlphabetScreen {...screenProps} />}
      {screen === "wordbuilder" && <WordBuilderScreen {...screenProps} />}
      {screen === "sentence" && <SentenceBuilderScreen {...screenProps} />}
      {screen === "minigames" && <MiniGamesScreen {...screenProps} />}
      {screen === "rewards" && <RewardsScreen {...screenProps} />}
      {screen === "parent" && <ParentDashboard {...screenProps} />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
