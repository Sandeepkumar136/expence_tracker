import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../appwrite/auth";
import { AuthContext } from "../context/AuthContext";
import { ProfileContext } from "../context/ProfileContext";
import { useDarkMode } from "../context/DarkModeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { name, email, phone, role } = useContext(ProfileContext);
  const {theme, setTheme} = useDarkMode();

  const handleLogout = async () => {
    try {
      await logout();       // 🔐 destroy session
      setUser(null);        // 🧹 clear state
      navigate("/login");   // 🔁 redirect
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <div className="s-container">
        <div className="s-contain-u">
          <i className="bx bx-user s-icon"></i>
          <h3 className="s-us-n">{name}</h3>
          <h3 className="s-us-e">{email}</h3>
          <h3 className="s-us-p">{phone}</h3>
        </div>
        <div className="s-contain-s">
          <div className="s-th-contain">
          <p className="s-th-nm">
            Theme
          </p>
          <div className="s-btn-c">
            <button onClick={() => setTheme("light")} className="s-btn"><i className="s-th-ic bx bx-sun"></i><span className="btn-th-t">Light</span></button>
            <button onClick={() => setTheme("dark")} className="s-btn"><i className="s-th-ic bx bx-moon-star" /><span className="btn-th-t">Dark</span></button>
            <button onClick={() => setTheme("system")} className="s-btn"><i className="s-th-ic bx bx-laptop"></i><span className="btn-th-t">System</span></button>
          </div>
          <p className="s-th-txt">Automatic is only supported on operating systems that allow you to control the system-wide color scheme.</p>
          </div>
          <div className="s-th-contain-l">
            <button onClick={handleLogout} className="s-btn-l"><i class="s-th-ic bx bx-arrow-out-right-square-half" /> Logout</button>
          </div>
        </div>
        <div className="s-contain-v">
          <h4 className="s-v-in"><i className="s-v-ic bx bx-git-compare"></i><span className="s-v-t">54.0 Client SDK</span></h4>
          <h4 className="s-v-in"><i className="s-v-ic bx bx-info-circle"></i> <span className="s-v-t">Version info</span></h4>
        </div>
      </div>
    </div>
  );
};

export default Settings;