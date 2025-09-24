import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthModal from "@/components/ui/authModal";
import { useAuth } from "@/api/useAuth";
import toast from "react-hot-toast";

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Protected navigation
  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      toast.success("Please login first");
      setAuthOpen(true);
      return;
    }
    navigate(path);
  };

  // 🎨 Active link style
  const linkClasses = (path: string) =>
    `font-medium transition ${
      location.pathname === path
        ? "text-green-600 font-semibold"
        : "text-gray-700 hover:text-green-600"
    }`;

  return (
    <>
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        {/* Logo / Brand */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold text-green-700 cursor-pointer hover:text-green-800 transition"
        >
          🌍 EnviroMonitor
        </div>

        {/* Nav Links */}
        <div className="space-x-6 flex items-center">
          <Link to="/" className={linkClasses("/")}>
            Home
          </Link>

          {/* Protected Links */}
          <button
            onClick={() => handleProtectedNavigation("/projects")}
            className={linkClasses("/projects")}
          >
            Projects
          </button>
          <button
            onClick={() => handleProtectedNavigation("/sites")}
            className={linkClasses("/sites")}
          >
            Sites
          </button>

          {/* Auth Section */}
          {!isAuthenticated ? (
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Login / Signup
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Hi, <span className="font-semibold">{user?.name}</span>
              </span>
              <button
                onClick={() => logout.mutate()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
