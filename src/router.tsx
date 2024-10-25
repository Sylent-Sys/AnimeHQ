import { createBrowserRouter } from "react-router-dom";
import HomepageRoute from "./pages/Homepage/HomepageRouter";
import MainLayout from "./layout/MainLayout";
import AnilistGrantedRoute from "./pages/Anilist/Granted/AnilistGrantedRoute";

const router = createBrowserRouter([
  AnilistGrantedRoute,
  {
    path: "/",
    element: <MainLayout />,
    children: [HomepageRoute],
  },
]);

export default router;
