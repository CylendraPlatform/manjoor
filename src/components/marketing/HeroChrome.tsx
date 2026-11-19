import { useMemo, useState, type ReactNode } from "react";
import { HeroChromeContext, type HeroThemeId } from "@/components/marketing/hero-chrome-context";

export function HeroChromeProvider({ overlay, children }: { overlay: boolean; children: ReactNode }) {
  const [theme, setTheme] = useState<HeroThemeId>("production");
  const value = useMemo(() => ({ overlay, theme, setTheme }), [overlay, theme]);
  return <HeroChromeContext.Provider value={value}>{children}</HeroChromeContext.Provider>;
}
