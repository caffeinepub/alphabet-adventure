interface GameHeaderProps {
  title: string;
  onBack: () => void;
  stars: number;
  emoji?: string;
  bgColor?: string;
}

export default function GameHeader({
  title,
  onBack,
  stars,
  emoji = "🎮",
  bgColor = "#FF6B6B",
}: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5 gap-3">
      <button
        type="button"
        onClick={onBack}
        className="kid-button px-4 py-3 text-base flex items-center gap-1"
        style={{ backgroundColor: "#64748b", minWidth: 90 }}
        data-ocid="nav.back_button"
      >
        🏠 Home
      </button>
      <div className="flex items-center gap-2 flex-1 justify-center">
        <span className="text-2xl">{emoji}</span>
        <h1
          className="text-xl md:text-3xl font-black text-center"
          style={{ color: bgColor }}
        >
          {title}
        </h1>
      </div>
      <div
        className="flex items-center gap-1 text-base font-black px-3 py-3 rounded-2xl text-white shadow-md"
        style={{ backgroundColor: "#FFB627", minWidth: 70 }}
      >
        ⭐ {stars}
      </div>
    </div>
  );
}
