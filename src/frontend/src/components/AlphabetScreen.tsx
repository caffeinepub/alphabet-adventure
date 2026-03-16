import { useState } from "react";
import { useSound } from "../hooks/useSound";
import type { ScreenProps } from "../types";
import GameHeader from "./GameHeader";

const ALPHABET = [
  { letter: "A", emoji: "🍎", word: "Apple" },
  { letter: "B", emoji: "⚽", word: "Ball" },
  { letter: "C", emoji: "🐱", word: "Cat" },
  { letter: "D", emoji: "🐶", word: "Dog" },
  { letter: "E", emoji: "🐘", word: "Elephant" },
  { letter: "F", emoji: "🐸", word: "Frog" },
  { letter: "G", emoji: "🍇", word: "Grapes" },
  { letter: "H", emoji: "🏠", word: "House" },
  { letter: "I", emoji: "🍦", word: "Ice Cream" },
  { letter: "J", emoji: "🃏", word: "Jelly" },
  { letter: "K", emoji: "🦘", word: "Kangaroo" },
  { letter: "L", emoji: "🦁", word: "Lion" },
  { letter: "M", emoji: "🐒", word: "Monkey" },
  { letter: "N", emoji: "📰", word: "Newspaper" },
  { letter: "O", emoji: "🍊", word: "Orange" },
  { letter: "P", emoji: "🐧", word: "Penguin" },
  { letter: "Q", emoji: "👸", word: "Queen" },
  { letter: "R", emoji: "🌈", word: "Rainbow" },
  { letter: "S", emoji: "☀️", word: "Sun" },
  { letter: "T", emoji: "🐯", word: "Tiger" },
  { letter: "U", emoji: "☂️", word: "Umbrella" },
  { letter: "V", emoji: "🎻", word: "Violin" },
  { letter: "W", emoji: "🐋", word: "Whale" },
  { letter: "X", emoji: "🎸", word: "Xylophone" },
  { letter: "Y", emoji: "🪀", word: "Yo-yo" },
  { letter: "Z", emoji: "🦓", word: "Zebra" },
];

const CARD_COLORS = [
  ["#FF6B6B", "#c0392b"],
  ["#FF8C42", "#d35400"],
  ["#FFD93D", "#b7950b"],
  ["#6BCB77", "#1e8449"],
  ["#4D96FF", "#1a5276"],
  ["#C77DFF", "#6c3483"],
  ["#FF6BD6", "#922b21"],
  ["#00CFFD", "#0e6655"],
  ["#FF9F1C", "#784212"],
  ["#A8FF3E", "#1d6a27"],
  ["#FF4D6D", "#7b241c"],
  ["#FFC300", "#9a7d0a"],
  ["#2ECC71", "#1a5e35"],
  ["#3498DB", "#1a5276"],
  ["#9B59B6", "#4a235a"],
  ["#E74C3C", "#78281f"],
  ["#F39C12", "#7d6608"],
  ["#1ABC9C", "#0e6655"],
  ["#E91E63", "#7b1040"],
  ["#00BCD4", "#0e6655"],
  ["#FF5722", "#7e2d12"],
  ["#8BC34A", "#33691e"],
  ["#03A9F4", "#01579b"],
  ["#AB47BC", "#4a148c"],
  ["#EC407A", "#880e4f"],
  ["#26C6DA", "#006064"],
];

export default function AlphabetScreen({ onBack, localStars }: ScreenProps) {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { speak } = useSound();

  const handleCardActivate = (index: number) => {
    setActiveCard(index);
    const item = ALPHABET[index];
    speak(`${item.letter}. ${item.word}`);
    setTimeout(() => setActiveCard(null), 800);
  };

  return (
    <div className="min-h-screen px-3 py-5 max-w-2xl mx-auto">
      <GameHeader
        title="Alphabet Adventure"
        onBack={onBack}
        stars={localStars}
        emoji="🔤"
        bgColor="#4D96FF"
      />
      <p
        className="text-center text-base font-black mb-4"
        style={{ color: "#4D96FF" }}
      >
        Tap a letter to hear it! 👂
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3">
        {ALPHABET.map((item, i) => {
          const [bg, border] = CARD_COLORS[i];
          const isActive = activeCard === i;
          return (
            <button
              key={item.letter}
              type="button"
              className="kid-card flex flex-col items-center justify-center py-3 gap-1 w-full"
              style={{
                backgroundColor: bg,
                borderColor: border,
                transform: isActive ? "scale(1.18)" : undefined,
                transition: "transform 0.15s ease",
              }}
              onClick={() => handleCardActivate(i)}
              data-ocid={`alphabet.card.${i + 1}`}
            >
              <span
                className="font-black leading-none"
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                  color: "white",
                  textShadow: "1px 2px 0 rgba(0,0,0,0.2)",
                }}
              >
                {item.letter}
              </span>
              <span style={{ fontSize: "clamp(1.2rem, 4vw, 1.8rem)" }}>
                {item.emoji}
              </span>
              <span
                className="text-white font-black text-center leading-tight"
                style={{ fontSize: "clamp(0.55rem, 1.8vw, 0.72rem)" }}
              >
                {item.word}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
