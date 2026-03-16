import { useCallback, useState } from "react";
import { useSound } from "../hooks/useSound";
import type { ScreenProps } from "../types";
import GameHeader from "./GameHeader";
import MascotOwl from "./MascotOwl";

const WORDS = [
  { word: "CAT", emoji: "🐱", distractors: ["B", "D", "R"] },
  { word: "DOG", emoji: "🐶", distractors: ["C", "P", "X"] },
  { word: "SUN", emoji: "☀️", distractors: ["A", "R", "T"] },
  { word: "CAR", emoji: "🚗", distractors: ["N", "D", "P"] },
  { word: "BIG", emoji: "🐘", distractors: ["A", "T", "R"] },
  { word: "FUN", emoji: "🎉", distractors: ["C", "B", "X"] },
  { word: "HAT", emoji: "🎩", distractors: ["M", "P", "R"] },
  { word: "PIG", emoji: "🐷", distractors: ["N", "T", "D"] },
  { word: "MAP", emoji: "🗺️", distractors: ["C", "N", "B"] },
  { word: "BUS", emoji: "🚌", distractors: ["T", "R", "P"] },
];

const TILE_COLORS = [
  "#FF6B6B",
  "#FF8C42",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#C77DFF",
  "#FF6BD6",
  "#00CFFD",
  "#FF9F1C",
  "#A8FF3E",
  "#FF4D6D",
  "#FFC300",
];

type ResultState = "" | "correct" | "wrong";

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface TileState {
  id: number;
  letter: string;
  used: boolean;
  colorIdx: number;
}

function buildPool(word: string, distractors: string[]): TileState[] {
  const letters = [...word.split(""), ...distractors];
  return shuffleArray(letters).map((l, i) => ({
    id: i,
    letter: l,
    used: false,
    colorIdx: i % TILE_COLORS.length,
  }));
}

// Pre-build slot keys for max word length to avoid array-index-as-key
const SLOT_KEYS = ["slot-0", "slot-1", "slot-2", "slot-3", "slot-4", "slot-5"];

export default function WordBuilderScreen({
  onBack,
  onAwardStars,
  triggerConfetti,
  localStars,
}: ScreenProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [slots, setSlots] = useState<(TileState | null)[]>(
    Array(WORDS[0].word.length).fill(null),
  );
  const [pool, setPool] = useState<TileState[]>(() =>
    buildPool(WORDS[0].word, WORDS[0].distractors),
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<ResultState>("");
  const [level, setLevel] = useState(1);
  const { speak, playCorrect, playWrong, playStarEarned, playClick } =
    useSound();

  const currentWord = WORDS[wordIndex];

  const checkWord = useCallback(
    (newSlots: (TileState | null)[]) => {
      if (newSlots.some((s) => s === null)) return;
      const built = newSlots.map((s) => s!.letter).join("");
      if (built === currentWord.word) {
        setResult("correct");
        playCorrect();
        setTimeout(() => playStarEarned(), 400);
        speak(currentWord.word);
        triggerConfetti();
        onAwardStars(1, "Word Builder", level);
      } else {
        setResult("wrong");
        playWrong();
        setTimeout(() => setResult(""), 900);
      }
    },
    [
      currentWord,
      level,
      speak,
      playCorrect,
      playWrong,
      playStarEarned,
      triggerConfetti,
      onAwardStars,
    ],
  );

  const handleTileClick = (tile: TileState) => {
    if (tile.used || result === "correct") return;
    playClick();
    if (selectedId === tile.id) {
      setSelectedId(null);
      return;
    }
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) {
      setSelectedId(tile.id);
      return;
    }
    const newSlots = [...slots];
    newSlots[emptyIdx] = tile;
    const newPool = pool.map((t) =>
      t.id === tile.id ? { ...t, used: true } : t,
    );
    setPool(newPool);
    setSlots(newSlots);
    setSelectedId(null);
    checkWord(newSlots);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (result === "correct") return;
    const tile = slots[slotIdx];
    if (!tile) return;
    playClick();
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    const newPool = pool.map((t) =>
      t.id === tile.id ? { ...t, used: false } : t,
    );
    setPool(newPool);
    setSlots(newSlots);
    setResult("");
  };

  const nextWord = () => {
    const next = (wordIndex + 1) % WORDS.length;
    const nextW = WORDS[next];
    setWordIndex(next);
    setSlots(Array(nextW.word.length).fill(null));
    setPool(buildPool(nextW.word, nextW.distractors));
    setSelectedId(null);
    setResult("");
    setLevel((l) => l + 1);
  };

  return (
    <div className="min-h-screen px-4 py-5 max-w-lg mx-auto flex flex-col">
      <GameHeader
        title="Word Builder"
        onBack={onBack}
        stars={localStars}
        emoji="🔨"
        bgColor="#6BCB77"
      />

      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="text-7xl">{currentWord.emoji}</div>
        <p className="text-base font-black text-muted-foreground">
          Build this word!
        </p>
      </div>

      <div
        className="flex justify-center gap-2 mb-3"
        data-ocid="wordbuilder.canvas_target"
      >
        {slots.map((slot, i) => (
          <button
            key={SLOT_KEYS[i] ?? `slot-${i}`}
            type="button"
            className={`letter-slot ${slot ? "filled" : ""} ${
              result === "correct" && slot ? "correct" : ""
            } ${result === "wrong" && slot ? "wrong" : ""}`}
            style={{
              borderColor: slot ? TILE_COLORS[slot.colorIdx] : "#94a3b8",
              backgroundColor: slot
                ? `${TILE_COLORS[slot.colorIdx]}33`
                : "white",
              color: slot ? TILE_COLORS[slot.colorIdx] : "#94a3b8",
            }}
            onClick={() => handleSlotClick(i)}
          >
            {slot?.letter ?? ""}
          </button>
        ))}
      </div>

      {result === "correct" && (
        <div
          className="text-center text-2xl font-black animate-pop-in mb-2"
          style={{ color: "#6BCB77" }}
        >
          🎉 Amazing! You spelled {currentWord.word}!
        </div>
      )}
      {result === "wrong" && (
        <div
          className="text-center text-lg font-black animate-shake-no mb-2"
          style={{ color: "#FF6B6B" }}
        >
          Try again! 💪
        </div>
      )}

      {result === "correct" ? (
        <button
          type="button"
          className="kid-button mx-auto px-8 py-4 text-lg mt-2"
          style={{ backgroundColor: "#6BCB77", borderBottomColor: "#16A34A" }}
          onClick={nextWord}
        >
          Next Word ➡️
        </button>
      ) : (
        <p className="text-center text-sm font-black text-muted-foreground mb-2">
          Tap a letter below — tap a slot to remove it
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-2 mt-auto pt-4">
        {pool
          .filter((t) => !t.used)
          .map((tile) => (
            <button
              key={tile.id}
              type="button"
              className={`letter-tile ${selectedId === tile.id ? "selected" : ""}`}
              style={{
                backgroundColor: TILE_COLORS[tile.colorIdx],
                borderColor: TILE_COLORS[tile.colorIdx],
                color: "white",
                textShadow: "1px 1px 0 rgba(0,0,0,0.2)",
              }}
              onClick={() => handleTileClick(tile)}
              data-ocid="wordbuilder.drag_handle"
            >
              {tile.letter}
            </button>
          ))}
      </div>

      <div className="flex justify-center mt-4">
        <MascotOwl
          tip={
            result === "correct"
              ? "Fantastic! 🎊"
              : "Tap letters to build the word!"
          }
        />
      </div>
    </div>
  );
}
