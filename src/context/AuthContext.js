import { createContext, useEffect, useState, useRef } from "react";
import { getUser } from "../appwrite/auth";
import LoadingBar from "react-top-loading-bar";
import { ThreeDots } from "react-loader-spinner";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadingBarRef = useRef(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        loadingBarRef.current?.continuousStart(); // 🔥 start bar

        const res = await getUser();
        setUser(res);

      } catch (error) {
        console.log("AUTH ERROR:", error);
        setUser(null);
      } finally {
        setLoading(false);
        loadingBarRef.current?.complete(); // 🔥 stop bar
      }
    };

    checkUser();
  }, []);

  // 🔥 GLOBAL LOADING SCREEN
  if (loading) {
    return (
      <div className="auth-loading-container">

        {/* 🔝 Top loading bar */}
        <LoadingBar
          color="#6366f1"
          ref={loadingBarRef}
          height={3}
        />

        {/* 🔄 Spinner */}
        <ThreeDots
          height="60"
          width="60"
          color="#6366f1"
          visible={true}
        />

        <p className="auth-text">Checking authentication...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};