import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "@/components/ui/authModal";
import { useAuth } from "@/api/useAuth";

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <>
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">🌍 EnviroMonitor</div>

        <div className="space-x-6 flex items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/projects" className="text-gray-700 hover:text-blue-600 font-medium">
                Projects
              </Link>
              <Link to="/sites" className="text-gray-700 hover:text-blue-600 font-medium">
                Sites
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Login / Signup
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Hi, {user?.name}</span>
              <button
                onClick={() => logout.mutate()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}
