import type { AnilistHelper } from "./helper/AnilistHelper";

declare global {
  interface Window {
    anilistHelper: AnilistHelper;
  }
}
