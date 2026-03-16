import { useCallback, useState } from "react";
import { useSound } from "../hooks/useSound";
import type { ScreenProps } from "../types";
import GameHeader from "./GameHeader";
import MascotOwl from "./MascotOwl";

const SENTENCES = [
  { sentence: "I see a cat", hint: "👁️ 🐱" },
  { sentence: "The sun is hot", hint: "☀️ 🔥" },
  { sentence: "I can run fast", hint: "🏃 💨" },
  { sentence: "A big red bus", hint: "🚌 🔴" },
  { sentence: "I love to play", hint: "❤️ 🎮" },
];

const CHIP_COLORS = [
  "#FF6B6B",
  "#4D96FF",
  "#6BCB77",
  "#FFD93D",
  "#C77DFF",
  "#FF9F1C",
];
// Pre-built stable slot keys (max 6 words in a sentence)
const SLOT_KEYS = ["sw-0", "sw-1", "sw-2", "sw-3", "sw-4", "sw-5"];

type ResultState = "" | "correct" | "wrong";

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface WordChip {
  id: number;
  word: string;
  used: boolean;
  colorIdx: number;
}

function buildChips(sentence: string): WordChip[] {
  const words = sentence.split(" ");
  return shuffleArray(words).map((w, i) => ({
    id: i,
    word: w,
    used: false,
    colorIdx: i % CHIP_COLORS.length,
  }));
}

export default function SentenceBuilderScreen({
  onBack,
  onAwardStars,
  triggerConfetti,
  localStars,
}: ScreenProps) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const current = SENTENCES[sentenceIndex];
  const words = current.sentence.split(" ");

  const [chips, setChips] = useState<WordChip[]>(() =>
    buildChips(current.sentence),
  );
  const [slots, setSlots] = useState<(WordChip | null)[]>(
    Array(words.length).fill(null),
  );
  const [result, setResult] = useState<ResultState>("");
  const [level, setLevel] = useState(1);
  const { speak, playCorrect, playWrong, playStarEarned, playClick } =
    useSound();

  const checkSentence = useCallback(
    (newSlots: (WordChip | null)[]) => {
      if (newSlots.some((s) => s === null)) return;
      const built = newSlots.map((s) => s!.word).join(" ");
      if (built === current.sentence) {
        setResult("correct");
        playCorrect();
        setTimeout(() => playStarEarned(), 400);
        speak(current.sentence);
        triggerConfetti();
        onAwardStars(2, "Sentence Builder", level);
      } else {
        setResult("wrong");
        playWrong();
        setTimeout(() => setResult(""), 900);
      }
    },
    [
      current,
      level,
      speak,
      playCorrect,
      playWrong,
      playStarEarned,
      triggerConfetti,
      onAwardStars,
    ],
  );

  const handleChipClick = (chip: WordChip) => {
    if (chip.used || result === "correct") return;
    playClick();
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) return;
    const newSlots = [...slots];
    newSlots[emptyIdx] = chip;
    const newChips = chips.map((c) =>
      c.id === chip.id ? { ...c, used: true } : c,
    );
    setChips(newChips);
    setSlots(newSlots);
    checkSentence(newSlots);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (result === "correct") return;
    const chip = slots[slotIdx];
    if (!chip) return;
    playClick();
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    const newChips = chips.map((c) =>
      c.id === chip.id ? { ...c, used: false } : c,
    );
    setChips(newChips);
    setSlots(newSlots);
    setResult("");
  };

  const nextSentence = () => {
    const next = (sentenceIndex + 1) % SENTENCES.length;
    const nextS = SENTENCES[next];
    const nextWords = nextS.sentence.split(" ");
    setSentenceIndex(next);
    setChips(buildChips(nextS.sentence));
    setSlots(Array(nextWords.length).fill(null));
    setResult("");
    setLevel((l) => l + 1);
  };

  return (
    <div className="min-h-screen px-4 py-5 max-w-lg mx-auto flex flex-col">
      <GameHeader
        title="Sentence Builder"
        onBack={onBack}
        stars={localStars}
        emoji="📝"
        bgColor="#FF9F1C"
      />

      <div className="flex flex-col items-center gap-2 mb-5">
        <div className="text-5xl">{current.hint}</div>
        <p className="text-base font-black text-muted-foreground">
          Arrange the words in order!
        </p>
      </div>

      <div
        className="flex flex-wrap justify-center gap-2 mb-3 p-3 rounded-3xl border-4 border-dashed"
        style={{ borderColor: "#FF9F1C", minHeight: 70 }}
        data-ocid="sentencebuilder.canvas_target"
      >
        {slots.map((slot, i) => (
          <button
            key={SLOT_KEYS[i] ?? `sw-${i}`}
            type="button"
            className={`rounded-2xl border-4 px-4 py-3 font-black text-base cursor-pointer transition-all duration-100 select-none flex items-center justify-center ${
              slot ? "border-solid" : "border-dashed"
            } ${result === "correct" && slot ? "correct" : ""}`}
            style={{
              borderColor: slot ? CHIP_COLORS[slot.colorIdx] : "#94a3b8",
              backgroundColor: slot
                ? `${CHIP_COLORS[slot.colorIdx]}33`
                : "white",
              color: slot ? CHIP_COLORS[slot.colorIdx] : "#94a3b8",
              minWidth: 60,
              minHeight: 48,
            }}
            onClick={() => handleSlotClick(i)}
          >
            {slot?.word ?? ""}
          </button>
        ))}
      </div>

      {result === "correct" && (
        <div
          className="text-center text-xl font-black animate-pop-in mb-2"
          style={{ color: "#6BCB77" }}
        >
          🎉 Perfect sentence!
        </div>
      )}
      {result === "wrong" && (
        <div
          className="text-center text-base font-black animate-shake-no mb-2"
          style={{ color: "#FF6B6B" }}
        >
          Not quite — try again! 💪
        </div>
      )}

      {result === "correct" && (
        <button
          type="button"
          className="kid-button mx-auto px-8 py-4 text-lg mt-1"
          style={{ backgroundColor: "#FF9F1C", borderBottomColor: "#D97706" }}
          onClick={nextSentence}
        >
          Next Sentence ➡️
        </button>
      )}

      <div className="flex flex-wrap justify-center gap-2 mt-auto pt-4">
        {chips
          .filter((c) => !c.used)
          .map((chip) => (
            <button
              key={chip.word}
              type="button"
              className="rounded-2xl border-4 border-solid px-4 py-3 font-black text-base cursor-pointer transition-all duration-100 select-none hover:scale-110 active:scale-95"
              style={{
                backgroundColor: CHIP_COLORS[chip.colorIdx],
                borderColor: CHIP_COLORS[chip.colorIdx],
                color: "white",
                textShadow: "1px 1px 0 rgba(0,0,0,0.2)",
              }}
              onClick={() => handleChipClick(chip)}
            >
              {chip.word}
            </button>
          ))}
      </div>

      <div className="flex justify-center mt-4">
        <MascotOwl
          tip={
            result === "correct"
              ? "You're a star! 🌟"
              : "Tap words to build the sentence!"
          }
        />
      </div>
    </div>
  );
}
