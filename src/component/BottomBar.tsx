import { FaHome, FaMoon, FaSun } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeStore } from "../hooks/useTheme";
import { useEffect, useState } from "react";
import { z } from "zod";
import userSchema from "../schema/user.schema";
import { useUserStore } from "../hooks/useUser";
import Modal from "./Modal";
import StorageHelper from "../helper/StorageHelper";

export default function BottomBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const themeStore = useThemeStore();
  const [user, setUser] = useState<z.infer<typeof userSchema> | null>(null);
  const modalLogin = Modal({
    id: "modal-login",
    title: "Login",
    content: "Hey there! want to login?",
    modalType: "confirm",
    onConfirm() {
      window.location.href = `https://anilist.co/api/v2/oauth/authorize?client_id=${import.meta.env.VITE_ANILIST_CLIENT_ID}&response_type=token`;
    },
    onCancel() {
      modalLogin.closeModal();
    },
  });
  const modalLogout = Modal({
    id: "modal-logout",
    title: "Logout",
    content: "Are you sure want to logout?",
    modalType: "confirm",
    onConfirm() {
      const storageHelper = new StorageHelper(localStorage);
      storageHelper.removeItem("user-storage");
      storageHelper.removeItem("anilist_token");
      setUser(null);
      window.location.href = window.location.origin;
    },
    onCancel() {
      modalLogout.closeModal();
    },
  });
  useEffect(() => {
    useUserStore.subscribe((user) => {
      setUser(user.user);
    });
  }, []);
  return (
    <>
      <div className="btm-nav btm-nav-lg">
        <button
          title="login"
          type="button"
          onClick={() => {
            if (user) {
              modalLogout.openModal();
              return;
            }
            modalLogin.openModal();
          }}
        >
          {user ? (
            <div className="avatar">
              <div className="w-4 rounded-full">
                <img alt="Avatar" src={user.data.Viewer.avatar.medium} />
              </div>
            </div>
          ) : (
            <MdLogin />
          )}
          <span className="btm-nav-label">{user ? "Logout" : "Login"}</span>
        </button>
        <button
          title="home"
          type="button"
          className={location.pathname == "/" ? "active" : ""}
          onClick={() => navigate("/")}
        >
          <FaHome />
          <span className="btm-nav-label">Home</span>
        </button>
        <button
          title="theme"
          type="button"
          onClick={() => {
            themeStore.setTheme(themeStore.theme === "dark" ? "light" : "dark");
          }}
        >
          {themeStore.theme === "dark" ? <FaSun /> : <FaMoon />}
          <span className="btm-nav-label">
            {themeStore.theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>
      </div>
      {modalLogin.modal}
      {modalLogout.modal}
    </>
  );
}
