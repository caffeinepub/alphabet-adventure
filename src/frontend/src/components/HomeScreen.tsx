import { useEffect, useState } from "react";
import { useTotalStars } from "../hooks/useQueries";
import type { ScreenProps } from "../types";
import MascotOwl from "./MascotOwl";

const TITLE = "Alphabet Adventure";
const LETTER_COLORS = [
  "#FF6B6B",
  "#FF8C42",
  "#FFC233",
  "#6BCB77",
  "#4D96FF",
  "#C77DFF",
  "#FF6BD6",
  "#00CFFD",
  "#FF9F1C",
  "#A8FF3E",
  "#FF4D6D",
  "#4D96FF",
  "#FFD93D",
  "#6BCB77",
  "#FF6B6B",
  "#C77DFF",
  "#FF8C42",
  "#00CFFD",
];

// Pre-build title chars with stable keys (not array index directly)
const TITLE_CHARS = TITLE.split("").map((ch, i) => ({ ch, id: `tc-${i}` }));

const TIPS = [
  "Let's learn the alphabet! 🔤",
  "Great job, keep playing! ⭐",
  "You're a star learner! 🌟",
  "Let's build some words! 📚",
];

const GAME_BUTTONS = [
  {
    label: "Alphabet",
    emoji: "🔤",
    screen: "alphabet" as const,
    color: "#4D96FF",
    border: "#2563EB",
    ocid: "home.alphabet_button",
  },
  {
    label: "Word Builder",
    emoji: "🔨",
    screen: "wordbuilder" as const,
    color: "#6BCB77",
    border: "#16A34A",
    ocid: "home.wordbuilder_button",
  },
  {
    label: "Sentences",
    emoji: "📝",
    screen: "sentence" as const,
    color: "#FF9F1C",
    border: "#D97706",
    ocid: "home.sentencebuilder_button",
  },
  {
    label: "Mini Games",
    emoji: "🎮",
    screen: "minigames" as const,
    color: "#C77DFF",
    border: "#7C3AED",
    ocid: "home.minigames_button",
  },
];

export default function HomeScreen({ onNavigate, localStars }: ScreenProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const { data: backendStars } = useTotalStars();
  const totalStars = localStars + Number(backendStars ?? 0n);

  useEffect(() => {
    const t = setInterval(
      () => setTipIndex((i) => (i + 1) % TIPS.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 max-w-2xl mx-auto">
      <div className="self-end mb-4 flex items-center gap-2 bg-yellow-300 px-4 py-2 rounded-2xl shadow-md font-black text-lg">
        ⭐ {totalStars} Stars
      </div>

      <MascotOwl tip={TIPS[tipIndex]} className="mb-2" />

      <div className="my-4 text-center px-2">
        <div className="flex flex-wrap justify-center gap-0.5 mb-1">
          {TITLE_CHARS.map(({ ch, id }, i) =>
            ch === " " ? (
              <span key={id} className="w-4" />
            ) : (
              <span
                key={id}
                className="inline-block animate-letter-bounce font-black text-3xl md:text-5xl"
                style={{
                  color: LETTER_COLORS[i % LETTER_COLORS.length],
                  animationDelay: `${i * 0.07}s`,
                  textShadow: "2px 3px 0 rgba(0,0,0,0.15)",
                }}
              >
                {ch}
              </span>
            ),
          )}
        </div>
        <p className="text-lg font-black" style={{ color: "#FF6BD6" }}>
          Learn. Play. Grow! 🌟
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mt-3 mb-6">
        {GAME_BUTTONS.map((btn) => (
          <button
            key={btn.screen}
            type="button"
            className="kid-button flex flex-col items-center justify-center gap-1 py-5 text-lg"
            style={{
              backgroundColor: btn.color,
              borderBottomColor: btn.border,
            }}
            onClick={() => onNavigate(btn.screen)}
            data-ocid={btn.ocid}
          >
            <span className="text-4xl">{btn.emoji}</span>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-3 w-full">
        <button
          type="button"
          className="kid-button flex-1 flex items-center justify-center gap-2 py-4 text-base"
          style={{
            backgroundColor: "#FFD93D",
            borderBottomColor: "#B45309",
            color: "#1a1a1a",
          }}
          onClick={() => onNavigate("rewards")}
          data-ocid="home.rewards_button"
        >
          <span className="text-2xl">⭐</span> My Rewards
        </button>
        <button
          type="button"
          className="kid-button px-5 py-4 text-sm"
          style={{ backgroundColor: "#94a3b8", borderBottomColor: "#475569" }}
          onClick={() => onNavigate("parent")}
          data-ocid="home.parent_button"
        >
          👨‍👩‍👧 Parent
        </button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
