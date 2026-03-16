import { useEffect, useRef } from "react";
import { useBadges, useTotalStars } from "../hooks/useQueries";
import type { ScreenProps } from "../types";
import GameHeader from "./GameHeader";

const BADGES = [
  { name: "Star Starter", emoji: "⭐", required: 5, desc: "Earn 5 stars" },
  { name: "Word Wizard", emoji: "🧙", required: 15, desc: "Earn 15 stars" },
  { name: "Sentence Star", emoji: "📝", required: 30, desc: "Earn 30 stars" },
  {
    name: "Alphabet Champion",
    emoji: "🏆",
    required: 50,
    desc: "Earn 50 stars",
  },
];

export default function RewardsScreen({
  onBack,
  localStars,
  triggerConfetti,
}: ScreenProps) {
  const { data: backendStars } = useTotalStars();
  const { data: backendBadges } = useBadges();
  const totalStars = localStars + Number(backendStars ?? 0n);
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    const hasNew = BADGES.some((b) => totalStars >= b.required);
    if (hasNew) {
      triggered.current = true;
      const t = setTimeout(() => triggerConfetti(), 300);
      return () => clearTimeout(t);
    }
  }, [totalStars, triggerConfetti]);

  const earnedBadgeNames = backendBadges ?? [];
  const isBadgeEarned = (badge: (typeof BADGES)[0]) =>
    totalStars >= badge.required || earnedBadgeNames.includes(badge.name);

  return (
    <div
      className="min-h-screen px-4 py-5 max-w-lg mx-auto"
      data-ocid="rewards.panel"
    >
      <GameHeader
        title="My Rewards"
        onBack={onBack}
        stars={totalStars}
        emoji="⭐"
        bgColor="#FFD93D"
      />

      <div
        className="flex flex-col items-center justify-center py-8 rounded-3xl mb-6 shadow-kids"
        style={{ background: "linear-gradient(135deg, #FFD93D, #FF9F1C)" }}
      >
        <div className="text-7xl animate-sparkle mb-2">⭐</div>
        <div
          className="text-5xl font-black text-white"
          style={{ textShadow: "2px 3px 0 rgba(0,0,0,0.2)" }}
        >
          {totalStars}
        </div>
        <div className="text-lg font-black text-white opacity-90">
          Total Stars Earned!
        </div>
      </div>

      <h2 className="text-xl font-black mb-3" style={{ color: "#C77DFF" }}>
        🏅 Badge Collection
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {BADGES.map((badge) => {
          const earned = isBadgeEarned(badge);
          return (
            <div
              key={badge.name}
              className={`kid-card p-4 flex flex-col items-center gap-2 text-center ${earned ? "animate-pop-in" : ""}`}
              style={{
                backgroundColor: earned ? "white" : "#f1f5f9",
                borderColor: earned ? "#FFD93D" : "#e2e8f0",
                filter: earned ? "none" : "grayscale(100%)",
                opacity: earned ? 1 : 0.55,
              }}
            >
              <div className={`text-5xl ${earned ? "animate-sparkle" : ""}`}>
                {badge.emoji}
              </div>
              <div className="font-black text-sm leading-tight">
                {badge.name}
              </div>
              <div className="text-xs font-bold text-muted-foreground">
                {badge.desc}
              </div>
              {earned ? (
                <div
                  className="text-xs font-black px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: "#6BCB77" }}
                >
                  ✓ Earned!
                </div>
              ) : (
                <div className="text-xs font-bold text-muted-foreground">
                  {badge.required - totalStars > 0
                    ? `${badge.required - totalStars} more stars needed`
                    : "Almost there!"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(() => {
        const next = BADGES.find((b) => !isBadgeEarned(b));
        if (!next) {
          return (
            <p
              className="text-center font-black mt-4"
              style={{ color: "#6BCB77" }}
            >
              🎊 All badges earned!
            </p>
          );
        }
        const pct = Math.min(
          100,
          Math.round((totalStars / next.required) * 100),
        );
        return (
          <div className="mt-5">
            <p className="text-sm font-black mb-1" style={{ color: "#FF9F1C" }}>
              Next badge: {next.name} ({totalStars}/{next.required} stars)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: "#FF9F1C" }}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
