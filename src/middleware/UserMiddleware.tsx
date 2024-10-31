import { useEffect, useCallback, useMemo } from "react";
import FetchDataHelper from "../helper/FetchDataHelper";
import userSchema from "../schema/user.schema";
import StorageHelper from "../helper/StorageHelper";
import { useUserStore } from "../hooks/useUser";
import { z } from "zod";
import userMediaSchema from "../schema/user-media.schema";

export default function UserMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchData: fetchUser, ...userData } =
    FetchDataHelper<z.infer<typeof userSchema>>();
  const { fetchData: fetchUserMedia, ...userMediaData } =
    FetchDataHelper<z.infer<typeof userMediaSchema>>();

  const setUser = useUserStore((state) => state.setUser);
  const getUser = useUserStore((state) => state.getUser);
  const setUserMedia = useUserStore((state) => state.setUserMedia);
  const getUserMedia = useUserStore((state) => state.getUserMedia);

  const storageHelper = useMemo(() => new StorageHelper(localStorage), []);

  const isTokenValid = useCallback(
    () => storageHelper.getItem("anilist_token") != null,
    [storageHelper],
  );

  const isUserStorageExpired = useCallback(() => {
    const expiration = storageHelper.getItem("expire-user-storage");
    return expiration ? new Date(expiration) < new Date() : true;
  }, [storageHelper]);

  const initializeExpiration = useCallback(() => {
    if (!storageHelper.getItem("expire-user-storage")) {
      storageHelper.setItem(
        "expire-user-storage",
        new Date(new Date().getTime() + 15 * 60 * 1000).toISOString(),
      );
    }
  }, [storageHelper]);

  const refreshUserState = useCallback(() => {
    if (getUser()) {
      setUser(getUser());
    } else if (isUserStorageExpired()) {
      setUser(null);
      initializeExpiration();
    } else {
      initializeExpiration();
      fetchUser(window.anilistHelper.getAuthenticatedUser(userSchema));
    }
  }, [fetchUser, getUser, initializeExpiration, isUserStorageExpired, setUser]);

  useEffect(() => {
    if (isTokenValid()) {
      refreshUserState();
    }
  }, [isTokenValid, refreshUserState]);

  useEffect(() => {
    if (userData.data) {
      setUser(userData.data);
      if (getUserMedia()) {
        setUserMedia(getUserMedia());
      } else {
        fetchUserMedia(
          window.anilistHelper.getUserMedia(
            userData.data.data.Viewer.id,
            userMediaSchema,
          ),
        );
      }
    }
  }, [setUser, userData.data, fetchUserMedia, getUserMedia, setUserMedia]);

  useEffect(() => {
    if (userMediaData.data) {
      setUserMedia(userMediaData.data);
    }
  }, [setUserMedia, userMediaData.data]);
  return children;
}
