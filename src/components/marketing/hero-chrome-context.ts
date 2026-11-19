import { createContext, useContext } from "react";

export type HeroThemeId = "production" | "craft" | "custom";

export interface HeroChromeValue {
  overlay: boolean;
  theme: HeroThemeId;
  setTheme: (theme: HeroThemeId) => void;
}

export const HeroChromeContext = createContext<HeroChromeValue | null>(null);

export function useHeroChrome(): HeroChromeValue | null {
  return useContext(HeroChromeContext);
}
