import { useState } from "react";
import { useSound } from "../../hooks/useSound";

interface Props {
  onComplete: (stars: number) => void;
}

const QUESTIONS = [
  { word: "CAT", missingIdx: 1, choices: ["A", "U", "O", "I"] },
  { word: "DOG", missingIdx: 1, choices: ["O", "A", "E", "U"] },
  { word: "SUN", missingIdx: 1, choices: ["U", "A", "O", "I"] },
  { word: "HAT", missingIdx: 0, choices: ["H", "B", "C", "D"] },
  { word: "PIG", missingIdx: 1, choices: ["I", "A", "O", "U"] },
  { word: "BUS", missingIdx: 2, choices: ["S", "T", "R", "N"] },
  { word: "CAR", missingIdx: 2, choices: ["R", "N", "T", "L"] },
  { word: "FUN", missingIdx: 0, choices: ["F", "B", "C", "D"] },
  { word: "MAP", missingIdx: 2, choices: ["P", "T", "N", "S"] },
  { word: "BIG", missingIdx: 1, choices: ["I", "A", "E", "O"] },
];

type AnswerState = "" | "correct" | "wrong";
const BTN_COLORS = ["#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D"];
// Pre-built keys to avoid array-index-as-key lint error
const STAR_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"];
const CHAR_KEYS = ["ck-0", "ck-1", "ck-2", "ck-3", "ck-4"];

export default function MissingLetterGame({ onComplete }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [answered, setAnswered] = useState<AnswerState>("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const { playCorrect, playWrong, speak } = useSound();

  const total = 5;
  const current = QUESTIONS[qIndex % QUESTIONS.length];
  const displayWord = current.word
    .split("")
    .map((ch, i) => (i === current.missingIdx ? "_" : ch));

  const handleChoice = (letter: string) => {
    if (answered || gameOver) return;
    setSelectedChoice(letter);
    if (letter === current.word[current.missingIdx]) {
      setAnswered("correct");
      playCorrect();
      speak(current.word);
      const newStars = starsEarned + 1;
      setStarsEarned(newStars);
      setTimeout(() => {
        if (qIndex + 1 >= total) {
          setGameOver(true);
          onComplete(newStars);
        } else {
          setQIndex(qIndex + 1);
          setAnswered("");
          setSelectedChoice(null);
        }
      }, 900);
    } else {
      setAnswered("wrong");
      playWrong();
      setTimeout(() => {
        setAnswered("");
        setSelectedChoice(null);
      }, 700);
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-5xl animate-sparkle">🏆</div>
        <div className="text-2xl font-black" style={{ color: "#6BCB77" }}>
          You got {starsEarned}/{total} stars!
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-1">
        {STAR_KEYS.slice(0, total).map((key, i) => (
          <span
            key={key}
            className="text-xl"
            style={{ opacity: i < qIndex ? 0.4 : i === qIndex ? 1 : 0.2 }}
          >
            {i < qIndex ? "⭐" : "☆"}
          </span>
        ))}
      </div>
      <p className="font-black text-base" style={{ color: "#FF9F1C" }}>
        What is the missing letter?
      </p>
      <div className="flex gap-2">
        {displayWord.map((ch, i) => (
          <div
            key={CHAR_KEYS[i] ?? `ck-${i}`}
            className="w-14 h-14 rounded-2xl border-4 flex items-center justify-center text-3xl font-black"
            style={{
              borderColor: ch === "_" ? "#FF9F1C" : "#6BCB77",
              backgroundColor: ch === "_" ? "#FFF3CD" : "#ECFDF5",
              color: ch === "_" ? "#FF9F1C" : "#166534",
            }}
          >
            {answered === "correct" && ch === "_"
              ? current.word[current.missingIdx]
              : ch}
          </div>
        ))}
      </div>

      {answered === "correct" && (
        <div
          className="text-xl font-black animate-pop-in"
          style={{ color: "#6BCB77" }}
        >
          ✅ Correct!
        </div>
      )}
      {answered === "wrong" && (
        <div
          className="text-xl font-black animate-shake-no"
          style={{ color: "#FF6B6B" }}
        >
          ❌ Try again!
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {current.choices.map((choice, i) => (
          <button
            key={choice}
            type="button"
            className="kid-button w-24 h-16 text-2xl"
            style={{
              backgroundColor:
                selectedChoice === choice && answered === "correct"
                  ? "#6BCB77"
                  : selectedChoice === choice && answered === "wrong"
                    ? "#FF6B6B"
                    : BTN_COLORS[i % BTN_COLORS.length],
              borderBottomColor: "rgba(0,0,0,0.2)",
            }}
            onClick={() => handleChoice(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
