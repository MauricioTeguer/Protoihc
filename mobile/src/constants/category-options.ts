export type CategoryIconKey =
  | "utensils"
  | "car"
  | "shopping-bag"
  | "film"
  | "receipt"
  | "heart-pulse"
  | "graduation-cap"
  | "coffee"
  | "home"
  | "plane"
  | "dumbbell"
  | "more-horizontal";

export const categoryColors = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#06B6D4",
  "#6B7280",
];

export const categoryIcons: { key: CategoryIconKey; symbol: string }[] = [
  { key: "utensils", symbol: "🍴" },
  { key: "car", symbol: "🚗" },
  { key: "shopping-bag", symbol: "🛍" },
  { key: "film", symbol: "🎞" },
  { key: "receipt", symbol: "🧾" },
  { key: "heart-pulse", symbol: "❤" },
  { key: "graduation-cap", symbol: "🎓" },
  { key: "coffee", symbol: "☕" },
  { key: "home", symbol: "⌂" },
  { key: "plane", symbol: "✈" },
  { key: "dumbbell", symbol: "🏋" },
  { key: "more-horizontal", symbol: "⋯" },
];
