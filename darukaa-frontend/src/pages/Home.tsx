import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🌍 Environmental Project Management
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Monitor, analyze, and manage your projects and sites with real-time
          insights.
        </p>

        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={() => navigate("/projects")}>
            View Projects
          </Button>
          <Button variant="secondary" onClick={() => navigate("/sites")}>
            View Sites
          </Button>
          <Button variant="secondary" onClick={() => navigate("/analytics")}>
            Analytics
          </Button>
        </div>
      </div>

      {/* Footer / Info */}
      <footer className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} EnviroTrack. Built with ❤️ for sustainability.
      </footer>
    </div>
  );
}
