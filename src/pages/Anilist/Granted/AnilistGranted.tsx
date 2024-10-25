import { useEffect } from "react";
import Loading from "../../../component/Loading";
import StorageHelper from "../../../helper/StorageHelper";

export default function AnilistGranted() {
  const fragment = window.location.hash;
  useEffect(() => {
    if (fragment) {
      const token = fragment.match(/access_token=([^&]*)/);
      if (token) {
        const storageHelper = new StorageHelper(localStorage);
        storageHelper.setItem("anilist_token", token[1]);
        window.location.href = "/";
      }
    }
  }, [fragment]);
  return <Loading />;
}
