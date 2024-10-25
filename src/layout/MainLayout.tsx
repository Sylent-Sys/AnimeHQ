import { Outlet } from "react-router-dom";
import ThemeMiddleware from "../middleware/ThemeMiddleware";
import BottomBar from "../component/BottomBar";
import UserMiddleware from "../middleware/UserMiddleware";

export default function MainLayout() {
  return (
    <ThemeMiddleware>
      <UserMiddleware>
        <Outlet />
        <BottomBar />
      </UserMiddleware>
    </ThemeMiddleware>
  );
}
