import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../appwrite/auth";
import { AuthContext } from "../context/AuthContext";
import { ProfileContext } from "../context/ProfileContext";
import { useDarkMode } from "../context/DarkModeContext";
import LoadingBar from "react-top-loading-bar";
import { ThreeDots } from "react-loader-spinner";

const Settings = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { name, email, phone } = useContext(ProfileContext);
  const { theme, setTheme } = useDarkMode();

  const [loading, setLoading] = useState(false);
  const loadingBarRef = useRef(null);

  const handleLogout = async () => {
    try {
      setLoading(true);
      loadingBarRef.current.continuousStart(); // 🔥 start bar

      await logout();
      setUser(null);

      loadingBarRef.current.complete(); // 🔥 stop bar
      navigate("/login");

    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">

      {/* 🔝 TOP LOADING BAR */}
      <LoadingBar color="#6366f1" ref={loadingBarRef} height={3} />

      {/* PROFILE CARD */}
      <div className="settings-card profile-card">
        <i className="bx bx-user settings-avatar"></i>
        <h3>{name}</h3>
        <p>{email}</p>
        <p>{phone}</p>
      </div>

      {/* THEME CARD */}
      <div className="settings-card">
        <h3 className="section-title">Theme</h3>

        <div className="theme-buttons">
          <button
            className={`theme-btn ${theme === "light" ? "active" : ""}`}
            onClick={() => setTheme("light")}
          >
            <i className="bx bx-sun"></i>
            Light
          </button>

          <button
            className={`theme-btn ${theme === "dark" ? "active" : ""}`}
            onClick={() => setTheme("dark")}
          >
            <i className="bx bx-moon"></i>
            Dark
          </button>

          <button
            className={`theme-btn ${theme === "system" ? "active" : ""}`}
            onClick={() => setTheme("system")}
          >
            <i className="bx bx-laptop"></i>
            System
          </button>
        </div>

        <p className="theme-info">
          System mode follows your OS theme.
        </p>
      </div>

      {/* LOGOUT CARD */}
      <div className="settings-card">
        <button className="logout-btn" onClick={handleLogout} disabled={loading}>
          {loading ? (
            <ThreeDots height="20" width="40" color="#fff" />
          ) : (
            <>
              <i className="bx bx-log-out"></i> Logout
            </>
          )}
        </button>
      </div>

      {/* VERSION CARD */}
      <div className="settings-card version-card">
        <p><i className="bx bx-git-compare"></i> SDK 54.0</p>
        <p><i className="bx bx-info-circle"></i> Version Info</p>
      </div>

    </div>
  );
};

export default Settings;