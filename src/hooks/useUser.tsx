import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import StorageHelper from "../helper/StorageHelper";
import { z } from "zod";
import userSchema from "../schema/user.schema";
import userMediaSchema from "../schema/user-media.schema";

interface UserState {
  user: z.infer<typeof userSchema> | null;
  setUser: (user: z.infer<typeof userSchema> | null) => void;
  getUser: () => z.infer<typeof userSchema> | null;
  userMedia: z.infer<typeof userMediaSchema> | null;
  setUserMedia: (userMedia: z.infer<typeof userMediaSchema> | null) => void;
  getUserMedia: () => z.infer<typeof userMediaSchema> | null;
}

export const useUserStore = create(
  persist<UserState>(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      getUser: () => get().user,
      userMedia: null,
      setUserMedia: (userMedia) => set({ userMedia }),
      getUserMedia: () => get().userMedia,
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => new StorageHelper(localStorage)),
    },
  ),
);
