import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import "./ui/Style.css";

import Accounts from "./components/Accounts";
import Transactions from "./components/Transactions";
import History from "./components/History";
import Settings from "./components/Settings";

import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./Pages/Login";
import { DarkModeProvider } from "./context/DarkModeContext";

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="main-content">{children}</div>
  </>
);

const App = () => {
  return (
    <Router>
      <DarkModeProvider>        
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Accounts />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Layout>
                <Transactions />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <History />
              </Layout>
            </ProtectedRoute>
          }
          />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
          />

        {/* ✅ Proper fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
          </DarkModeProvider>
    </Router>
  );
};

export default App;