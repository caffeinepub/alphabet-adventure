import { useEffect, useState } from "react";
import { useSound } from "../../hooks/useSound";

interface Props {
  onComplete: (stars: number) => void;
}

const SETS = [
  [
    { word: "CAT", emoji: "🐱" },
    { word: "DOG", emoji: "🐶" },
    { word: "SUN", emoji: "☀️" },
    { word: "CAR", emoji: "🚗" },
  ],
  [
    { word: "FROG", emoji: "🐸" },
    { word: "FISH", emoji: "🐟" },
    { word: "BIRD", emoji: "🐦" },
    { word: "CAKE", emoji: "🎂" },
  ],
  [
    { word: "LION", emoji: "🦁" },
    { word: "BEAR", emoji: "🐻" },
    { word: "STAR", emoji: "⭐" },
    { word: "MOON", emoji: "🌙" },
  ],
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function PictureWordGame({ onComplete }: Props) {
  const [setIndex] = useState(() => Math.floor(Math.random() * SETS.length));
  const currentSet = SETS[setIndex];
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [matches, setMatches] = useState<Map<string, string>>(new Map());
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { playCorrect, playWrong, playStarEarned } = useSound();

  useEffect(() => {
    setShuffledWords(shuffle(currentSet.map((x) => x.word)));
  }, [currentSet]);

  const isWordMatched = (word: string) => [...matches.values()].includes(word);
  const isEmojiMatched = (emoji: string) => matches.has(emoji);

  const handleWordClick = (word: string) => {
    if (isWordMatched(word) || done) return;
    setSelectedWord((prev) => (prev === word ? null : word));
  };

  const handleEmojiClick = (emoji: string, correctWord: string) => {
    if (isEmojiMatched(emoji) || done || !selectedWord) return;
    if (selectedWord === correctWord) {
      const newMatches = new Map(matches);
      newMatches.set(emoji, selectedWord);
      setMatches(newMatches);
      setSelectedWord(null);
      playCorrect();
      if (newMatches.size === currentSet.length) {
        setDone(true);
        setTimeout(() => playStarEarned(), 400);
        onComplete(2);
      }
    } else {
      setWrongFlash(emoji);
      playWrong();
      setTimeout(() => {
        setWrongFlash(null);
        setSelectedWord(null);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="font-black text-base" style={{ color: "#4D96FF" }}>
        Select a word, then tap the matching picture!
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        {currentSet.map((item) => {
          const isMatched = isEmojiMatched(item.emoji);
          const isWrong = wrongFlash === item.emoji;
          return (
            <button
              key={item.emoji}
              type="button"
              className={`kid-card flex items-center justify-center text-5xl w-20 h-20 ${isWrong ? "animate-shake-no" : ""}`}
              style={{
                backgroundColor: isMatched
                  ? "#6BCB7733"
                  : isWrong
                    ? "#FF6B6B22"
                    : "white",
                borderColor: isMatched
                  ? "#6BCB77"
                  : isWrong
                    ? "#FF6B6B"
                    : "#e2e8f0",
              }}
              onClick={() => handleEmojiClick(item.emoji, item.word)}
            >
              {item.emoji}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {shuffledWords.map((word) => {
          const isMatched = isWordMatched(word);
          const isSelected = selectedWord === word;
          return (
            <button
              key={word}
              type="button"
              className="rounded-2xl border-4 px-5 py-3 font-black text-base cursor-pointer transition-all duration-100 select-none hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isMatched
                  ? "#6BCB77"
                  : isSelected
                    ? "#4D96FF"
                    : "#f8fafc",
                borderColor: isMatched
                  ? "#16a34a"
                  : isSelected
                    ? "#2563eb"
                    : "#cbd5e1",
                color: isMatched || isSelected ? "white" : "#334155",
                opacity: isMatched ? 0.6 : 1,
              }}
              onClick={() => handleWordClick(word)}
            >
              {word}
            </button>
          );
        })}
      </div>

      {done && (
        <div
          className="text-2xl font-black animate-pop-in"
          style={{ color: "#6BCB77" }}
        >
          🎉 All matched! +2 ⭐
        </div>
      )}
    </div>
  );
}
