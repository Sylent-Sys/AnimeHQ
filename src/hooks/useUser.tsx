import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import StorageHelper from "../helper/StorageHelper";
import { z } from "zod";
import userSchema from "../schema/user.schema";

interface UserState {
  user: z.infer<typeof userSchema> | null;
  setUser: (user: z.infer<typeof userSchema> | null) => void;
  getUser: () => z.infer<typeof userSchema> | null;
}

export const useUserStore = create(
  persist<UserState>(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      getUser: () => get().user,
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => new StorageHelper(localStorage)),
    },
  ),
);
