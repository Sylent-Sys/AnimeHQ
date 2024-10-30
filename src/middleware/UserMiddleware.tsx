import { useEffect } from "react";
import FetchDataHelper from "../helper/FetchDataHelper";
import userSchema from "../schema/user.schema";
import StorageHelper from "../helper/StorageHelper";
import { useUserStore } from "../hooks/useUser";
import { z } from "zod";

export default function UserMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchData: fetchUser, ...userData } =
    FetchDataHelper<z.infer<typeof userSchema>>();
  const setUser = useUserStore((state) => state.setUser);
  const getUser = useUserStore((state) => state.getUser);
  useEffect(() => {
    const storageHelper = new StorageHelper(localStorage);
    if (!storageHelper.getItem("anilist_token")) {
      return;
    } else {
      if (storageHelper.getItem("user-storage")) {
        setUser(getUser());
      }
      if (
        storageHelper.getItem("expire-user-storage") != null &&
        new Date(storageHelper.getItem("expire-user-storage") as string) >
          new Date()
      ) {
        return;
      }
      if (
        storageHelper.getItem("expire-user-storage") &&
        new Date(storageHelper.getItem("expire-user-storage") as string) <
          new Date()
      ) {
        setUser(null);
        storageHelper.setItem(
          "expire-user-storage",
          new Date(new Date().getTime() + 15 * 60 * 1000).toISOString(),
        );
      }
      if (storageHelper.getItem("expire-user-storage") == null) {
        storageHelper.setItem(
          "expire-user-storage",
          new Date(new Date().getTime() + 15 * 60 * 1000).toISOString(),
        );
      }
    }
    fetchUser(window.anilistHelper.getAuthenticatedUser(userSchema));
  }, [fetchUser, getUser, setUser]);
  useEffect(() => {
    if (userData.data) {
      setUser(userData.data);
    }
  }, [setUser, userData.data]);
  return children;
}
