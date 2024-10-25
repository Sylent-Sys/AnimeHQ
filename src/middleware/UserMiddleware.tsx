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
    if (storageHelper.getItem("user-storage")) {
      setUser(getUser());
      return;
    }
    if (!storageHelper.getItem("anilist_token")) {
      return;
    }
    fetchUser({
      apiUrl: "https://graphql.anilist.co",
      url: "/",
      method: "POST",
      schema: userSchema,
      axiosConfig: {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          query: `query {
  Viewer {
    avatar {
      medium
    }
    name
    id
    mediaListOptions {
      animeList {
        customLists
      }
    }
  }
}
`,
        },
      },
    });
  }, [fetchUser, getUser, setUser]);
  useEffect(() => {
    if (userData.data) {
      setUser(userData.data);
    }
  }, [setUser, userData.data]);
  return children;
}
