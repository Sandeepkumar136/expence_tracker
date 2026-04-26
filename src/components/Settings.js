import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../appwrite/auth";
import { AuthContext } from "../context/AuthContext";
import { ProfileContext } from "../context/ProfileContext";

const Settings = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { name, email, phone, role } = useContext(ProfileContext);

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
      <h2>Settings</h2>

      {/* 👤 User Info */}
      <div>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Role:</strong> {role}</p>
      </div>

      {/* 🚪 Logout Button */}
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Settings;