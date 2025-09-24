import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function HomePage() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.success("Please login first");
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl animate-fade-in">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          🌍 Environmental Project Management
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Monitor, analyze, and manage your projects and sites with{" "}
          <span className="font-semibold text-green-600">real-time insights</span> 
          for a sustainable future.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            className="px-6 py-3 text-lg rounded-xl shadow-md hover:shadow-lg transition"
            variant="primary"
            onClick={() => handleNavigation("/projects")}
          >
            📂 View Projects
          </Button>

          <Button
            className="px-6 py-3 text-lg rounded-xl shadow-md hover:shadow-lg transition"
            variant="secondary"
            onClick={() => handleNavigation("/sites")}
          >
            🏞️ View Sites
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">EnviroTrack</span>. Built with ❤️ for sustainability.
      </footer>
    </div>
  );
}
