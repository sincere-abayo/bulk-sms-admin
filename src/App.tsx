import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Login from "./components/auth/Login";
import Landing from "./components/landing/Landing";
import Dashboard from "./components/dashboard/Dashboard";
import Users from "./components/users/Users";
import Messages from "./components/messages/Messages";
import Analytics from "./components/analytics/Analytics";
import Settings from "./components/settings/Settings";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Styles
import "./app.css";

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
}

function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <div className="w-full h-full">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
