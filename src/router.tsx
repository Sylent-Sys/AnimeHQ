import { createBrowserRouter } from "react-router-dom";
import HomepageRoute from "./pages/Homepage/HomepageRouter";
import MainLayout from "./layout/MainLayout";
import AnilistGrantedRoute from "./pages/Anilist/Granted/AnilistGrantedRoute";
import AnimeSearchRoute from "./pages/Anime/Search/AnimeSearchRouter";

const router = createBrowserRouter([
  AnilistGrantedRoute,
  {
    path: "/",
    element: <MainLayout />,
    children: [HomepageRoute, AnimeSearchRoute],
  },
]);

export default router;
