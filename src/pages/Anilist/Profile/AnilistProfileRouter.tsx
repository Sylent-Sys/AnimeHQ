import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Loading from "../../../component/Loading";

const AnilistProfile = lazy(() => import("./AnilistProfile"));
const AnilistProfileRoute: RouteObject = {
  path: "/anilist/profile",
  element: (
    <Suspense fallback={<Loading />}>
      <AnilistProfile />
    </Suspense>
  ),
};

export default AnilistProfileRoute;
