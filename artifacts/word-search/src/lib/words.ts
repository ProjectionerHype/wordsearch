export const THEMES = {
  Animals: ["ELEPHANT", "GIRAFFE", "PENGUIN", "DOLPHIN", "KANGAROO", "CHEETAH", "OCTOPUS", "TIGER", "MONKEY", "ZEBRA", "RHINO", "IGUANA"],
  Fruits: ["STRAWBERRY", "WATERMELON", "PINEAPPLE", "BLUEBERRY", "RASPBERRY", "MANGO", "BANANA", "ORANGE", "PEACH", "GRAPES", "APPLE", "CHERRY"],
  Countries: ["ARGENTINA", "BRAZIL", "CANADA", "DENMARK", "EGYPT", "FRANCE", "GREECE", "HUNGARY", "ITALY", "JAPAN", "KENYA", "MEXICO"],
  Sports: ["BASKETBALL", "VOLLEYBALL", "BASEBALL", "FOOTBALL", "TENNIS", "SOCCER", "HOCKEY", "CRICKET", "RUGBY", "GOLF", "SWIMMING", "BOXING"],
  Space: ["GALAXY", "NEBULA", "ASTEROID", "COMET", "METEOR", "PLANET", "STAR", "ORBIT", "ECLIPSE", "ROCKET", "COSMOS", "GRAVITY"],
  Music: ["GUITAR", "PIANO", "DRUMS", "VIOLIN", "TRUMPET", "FLUTE", "SAXOPHONE", "CELLO", "MELODY", "RHYTHM", "CHORD", "HARMONY"],
  Tech: ["COMPUTER", "NETWORK", "SOFTWARE", "INTERNET", "DATABASE", "KEYBOARD", "MONITOR", "BROWSER", "ROUTER", "SERVER", "CODING", "LAPTOP"],
  Nature: ["MOUNTAIN", "FOREST", "RIVER", "OCEAN", "DESERT", "CANYON", "VALLEY", "ISLAND", "JUNGLE", "VOLCANO", "GLACIER", "TUNDRA"]
};

export type ThemeName = keyof typeof THEMES;
export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];

export type Difficulty = "Easy" | "Medium" | "Hard";

export const DIFFICULTY_SETTINGS = {
  Easy: { size: 8, directions: [[0, 1], [1, 0]], wordsCount: 6 },
  Medium: { size: 12, directions: [[0, 1], [1, 0], [1, 1], [-1, 1]], wordsCount: 8 },
  Hard: { size: 15, directions: [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]], wordsCount: 12 }
};
