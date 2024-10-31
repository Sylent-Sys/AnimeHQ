import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Loading from "../../../component/Loading";

const AnimeSearch = lazy(() => import("./AnimeSearch"));
const AnimeSearchRoute: RouteObject = {
  path: "/anime/search",
  element: (
    <Suspense fallback={<Loading />}>
      <AnimeSearch />
    </Suspense>
  ),
};

export default AnimeSearchRoute;
