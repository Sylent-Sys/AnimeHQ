import type { AnilistHelper } from "./helper/AnilistHelper";

declare global {
  interface Window {
    anilistHelper: AnilistHelper;
    ongoingRequests: Map<string, AbortController>;
  }
}
