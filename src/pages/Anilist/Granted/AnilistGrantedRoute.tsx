import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Loading from "../../../component/Loading";

const AnilistGranted = lazy(() => import("./AnilistGranted"));
const AnilistGrantedRoute: RouteObject = {
  path: "/anilist/granted",
  element: (
    <Suspense fallback={<Loading />}>
      <AnilistGranted />
    </Suspense>
  ),
};

export default AnilistGrantedRoute;
