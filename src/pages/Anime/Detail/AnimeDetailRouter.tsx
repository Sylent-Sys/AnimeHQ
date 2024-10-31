import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Loading from "../../../component/Loading";

const AnimeDetail = lazy(() => import("./AnimeDetail"));
const AnimeDetailRoute: RouteObject = {
  path: "/anime/detail/:idAnime",
  element: (
    <Suspense fallback={<Loading />}>
      <AnimeDetail />
    </Suspense>
  ),
};

export default AnimeDetailRoute;
