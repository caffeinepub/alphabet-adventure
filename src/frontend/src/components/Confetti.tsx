import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  shape: "circle" | "square" | "diamond";
  duration: number;
}

const COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6BD6",
  "#FF9F1C",
  "#A8FF3E",
  "#00CFFD",
  "#FF4D6D",
  "#C77DFF",
];

const SHAPES: Particle["shape"][] = ["circle", "square", "diamond"];

export default function Confetti({ onDone }: { onDone?: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const ps: Particle[] = Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 1.8,
      size: Math.random() * 11 + 7,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      duration: Math.random() * 1.5 + 2,
    }));
    setParticles(ps);
    const t = setTimeout(() => {
      setParticles([]);
      onDone?.();
    }, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius:
              p.shape === "circle"
                ? "50%"
                : p.shape === "diamond"
                  ? "2px"
                  : "3px",
            transform: p.shape === "diamond" ? "rotate(45deg)" : "rotate(0deg)",
            animationName: "confettiFall",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: "ease-in",
            animationFillMode: "forwards",
          }}
        />
      ))}
    </div>
  );
}
