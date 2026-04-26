import { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const profile = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.labels?.[0] || "user",
  };

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};