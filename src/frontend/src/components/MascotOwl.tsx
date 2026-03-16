interface MascotOwlProps {
  tip?: string;
  className?: string;
}

export default function MascotOwl({ tip, className = "" }: MascotOwlProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {tip && <div className="speech-bubble animate-pop-in">{tip}</div>}
      <div
        className="animate-float-bob text-6xl md:text-7xl cursor-default select-none"
        role="img"
        aria-label="Owl mascot"
      >
        🦉
      </div>
    </div>
  );
}
