export type Screen =
  | "home"
  | "alphabet"
  | "wordbuilder"
  | "sentence"
  | "minigames"
  | "rewards"
  | "parent";

export interface ScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onAwardStars: (
    stars: number,
    activity: string,
    level: number,
  ) => Promise<void>;
  triggerConfetti: () => void;
  localStars: number;
}
