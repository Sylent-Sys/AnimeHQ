import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import DisableDevtool from "disable-devtool";
import { AnilistHelper } from "./helper/AnilistHelper.ts";

if (import.meta.env.PROD) {
  DisableDevtool({
    clearLog: true,
  });
}

window.anilistHelper = new AnilistHelper();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
