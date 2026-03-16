import { useEffect, useState } from "react";
import { useSound } from "../../hooks/useSound";

interface Props {
  onComplete: (stars: number) => void;
}

const LETTER_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function pickPairs(n: number): string[] {
  return LETTER_POOL.split("")
    .sort(() => Math.random() - 0.5)
    .slice(0, n);
}

function shuffleArr<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const PAIR_COLORS = ["#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D", "#C77DFF"];

export default function LetterMatchGame({ onComplete }: Props) {
  const [pairs, setPairs] = useState<string[]>([]);
  const [upperOrder, setUpperOrder] = useState<string[]>([]);
  const [lowerOrder, setLowerOrder] = useState<string[]>([]);
  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [matched, setMatched] = useState<Map<string, string>>(new Map());
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { playCorrect, playWrong, playStarEarned } = useSound();

  useEffect(() => {
    const p = pickPairs(5);
    setPairs(p);
    setUpperOrder(shuffleArr(p));
    setLowerOrder(shuffleArr(p));
  }, []);

  const handleUpperClick = (letter: string) => {
    if (matched.has(letter) || done) return;
    setSelectedUpper(letter);
  };

  const handleLowerClick = (letter: string) => {
    if ([...matched.values()].includes(letter) || done) return;
    if (!selectedUpper) return;
    if (selectedUpper === letter) {
      const newMatched = new Map(matched);
      newMatched.set(selectedUpper, letter);
      setMatched(newMatched);
      setSelectedUpper(null);
      playCorrect();
      if (newMatched.size === pairs.length) {
        setDone(true);
        setTimeout(() => playStarEarned(), 400);
        onComplete(2);
      }
    } else {
      setWrongFlash(letter);
      playWrong();
      setTimeout(() => {
        setWrongFlash(null);
        setSelectedUpper(null);
      }, 600);
    }
  };

  const getMatchColor = (upper: string): string | undefined => {
    if (!matched.has(upper)) return undefined;
    const idx = pairs.indexOf(upper);
    return PAIR_COLORS[idx % PAIR_COLORS.length];
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-black text-base" style={{ color: "#C77DFF" }}>
        Match the uppercase and lowercase letters!
      </p>
      <div className="flex gap-8 justify-center w-full">
        <div className="flex flex-col gap-3">
          <p className="text-center font-black text-sm text-muted-foreground">
            BIG
          </p>
          {upperOrder.map((letter) => {
            const color = getMatchColor(letter);
            const isSelected = selectedUpper === letter;
            return (
              <button
                key={`upper-${letter}`}
                type="button"
                className="letter-tile w-14 h-14 text-2xl"
                style={{
                  backgroundColor:
                    color ?? (isSelected ? "#FF6BD6" : "#f1f5f9"),
                  borderColor: color ?? (isSelected ? "#EC4899" : "#cbd5e1"),
                  color: color ?? (isSelected ? "white" : "#334155"),
                  opacity: matched.has(letter) ? 0.7 : 1,
                }}
                onClick={() => handleUpperClick(letter)}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-center font-black text-sm text-muted-foreground">
            small
          </p>
          {lowerOrder.map((letter) => {
            const lower = letter.toLowerCase();
            const matchedPair = [...matched.entries()].find(
              ([, v]) => v === letter,
            );
            const color = matchedPair
              ? PAIR_COLORS[pairs.indexOf(matchedPair[0]) % PAIR_COLORS.length]
              : undefined;
            const isWrong = wrongFlash === letter;
            return (
              <button
                key={`lower-${letter}`}
                type="button"
                className={`letter-tile w-14 h-14 text-2xl ${isWrong ? "animate-shake-no" : ""}`}
                style={{
                  backgroundColor: color ?? (isWrong ? "#FF6B6B" : "#f1f5f9"),
                  borderColor: color ?? (isWrong ? "#dc2626" : "#cbd5e1"),
                  color: color ?? (isWrong ? "white" : "#334155"),
                  opacity: matchedPair ? 0.7 : 1,
                }}
                onClick={() => handleLowerClick(letter)}
              >
                {lower}
              </button>
            );
          })}
        </div>
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
