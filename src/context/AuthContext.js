import { createContext, useEffect, useState } from "react";
import { getUser } from "../appwrite/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getUser();   // ✅ res defined HERE
        console.log("AUTH USER:", res); // ✅ log inside scope
        setUser(res);
      } catch (error) {
        console.log("AUTH ERROR:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return <div>Checking auth...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};