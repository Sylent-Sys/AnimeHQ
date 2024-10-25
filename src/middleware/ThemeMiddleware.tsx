import { useEffect } from "react";
import { useThemeStore } from "../hooks/useTheme";
import { useShallow } from "zustand/shallow";

export default function ThemeMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeStore = useThemeStore(useShallow((state) => state));
  useEffect(() => {
    if (
      !document.documentElement.dataset.theme &&
      themeStore.getTheme() == null
    ) {
      const theme = window.matchMedia("(prefers-color-scheme: dark)");
      themeStore.setTheme(theme.matches ? "dark" : "light");
    }
    if (themeStore.getTheme() != null) {
      const theme = themeStore.getTheme();
      if (theme == null || theme == undefined) {
        return;
      }
      document.documentElement.dataset.theme = theme;
      themeStore.setTheme(theme);
    }
  }, [themeStore]);
  return children;
}
