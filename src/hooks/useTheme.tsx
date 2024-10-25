import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import StorageHelper from "../helper/StorageHelper";

interface ThemeState {
  theme: string | null;
  setTheme: (theme: string | null) => void;
  getTheme: () => string | null;
}

export const useThemeStore = create(
  persist<ThemeState>(
    (set, get) => ({
      theme: null,
      setTheme: (theme) => set({ theme }),
      getTheme: () => get().theme,
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => new StorageHelper(localStorage)),
    },
  ),
);
