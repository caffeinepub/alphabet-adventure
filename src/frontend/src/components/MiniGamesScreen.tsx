import { useState } from "react";
import type { ScreenProps } from "../types";
import GameHeader from "./GameHeader";
import MascotOwl from "./MascotOwl";
import LetterMatchGame from "./games/LetterMatchGame";
import MissingLetterGame from "./games/MissingLetterGame";
import PictureWordGame from "./games/PictureWordGame";

type SubGame = "menu" | "letter-match" | "picture-word" | "missing-letter";

const GAME_LIST = [
  {
    id: "letter-match" as SubGame,
    label: "Letter Match",
    emoji: "🔤",
    desc: "Match big and small letters!",
    color: "#C77DFF",
    border: "#7C3AED",
    ocid: "minigames.tab.1",
  },
  {
    id: "picture-word" as SubGame,
    label: "Picture & Word",
    emoji: "🖼️",
    desc: "Match pictures to words!",
    color: "#4D96FF",
    border: "#1D4ED8",
    ocid: "minigames.tab.2",
  },
  {
    id: "missing-letter" as SubGame,
    label: "Missing Letter",
    emoji: "❓",
    desc: "Fill in the missing letter!",
    color: "#FF9F1C",
    border: "#D97706",
    ocid: "minigames.tab.3",
  },
];

export default function MiniGamesScreen({
  onBack,
  onAwardStars,
  triggerConfetti,
  localStars,
}: ScreenProps) {
  const [subGame, setSubGame] = useState<SubGame>("menu");
  const [gameKey, setGameKey] = useState(0);

  const handleComplete = (stars: number) => {
    triggerConfetti();
    onAwardStars(stars, "Mini Games", 1);
  };

  const launchGame = (id: SubGame) => {
    setSubGame(id);
    setGameKey((k) => k + 1);
  };

  const backToMenu = () => setSubGame("menu");
  const currentGame = GAME_LIST.find((g) => g.id === subGame);

  return (
    <div className="min-h-screen px-4 py-5 max-w-lg mx-auto flex flex-col">
      <GameHeader
        title={
          subGame === "menu"
            ? "Mini Games"
            : (currentGame?.label ?? "Mini Games")
        }
        onBack={subGame === "menu" ? onBack : backToMenu}
        stars={localStars}
        emoji="🎮"
        bgColor="#C77DFF"
      />

      {subGame === "menu" ? (
        <>
          <div className="flex justify-center mb-5">
            <MascotOwl tip="Pick a game to play!" />
          </div>
          <div className="flex flex-col gap-4">
            {GAME_LIST.map((game) => (
              <button
                key={game.id}
                type="button"
                className="kid-button flex items-center gap-4 px-6 py-5 text-left text-base"
                style={{
                  backgroundColor: game.color,
                  borderBottomColor: game.border,
                }}
                onClick={() => launchGame(game.id)}
                data-ocid={game.ocid}
              >
                <span className="text-4xl">{game.emoji}</span>
                <div>
                  <div className="text-lg font-black">{game.label}</div>
                  <div className="text-sm font-bold opacity-90">
                    {game.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white/70 rounded-3xl p-5 shadow-kids mt-2">
          {subGame === "letter-match" && (
            <LetterMatchGame key={gameKey} onComplete={handleComplete} />
          )}
          {subGame === "picture-word" && (
            <PictureWordGame key={gameKey} onComplete={handleComplete} />
          )}
          {subGame === "missing-letter" && (
            <MissingLetterGame key={gameKey} onComplete={handleComplete} />
          )}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              className="kid-button px-6 py-3 text-base"
              style={{
                backgroundColor: "#94a3b8",
                borderBottomColor: "#475569",
              }}
              onClick={() => launchGame(subGame)}
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
