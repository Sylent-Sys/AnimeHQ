import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Loading from "../../component/Loading";

const Homepage = lazy(() => import("./Homepage"));
const HomepageRoute: RouteObject = {
  path: "/",
  element: (
    <Suspense fallback={<Loading />}>
      <Homepage />
    </Suspense>
  ),
};

export default HomepageRoute;
