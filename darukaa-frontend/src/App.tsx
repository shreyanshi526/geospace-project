import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Sites from "@/pages/Sites";
import MapPage from "@/pages/MapPage";
import ProjectDetailPage from "@/pages/ProjectDetailsPage";
import SiteAnalyticsPage from "@/pages/SiteAnalyticsPage";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/api/useAuth";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={isAuthenticated ? <Projects /> : <Navigate to="/" replace />} />
        <Route path="/sites" element={isAuthenticated ? <Sites /> : <Navigate to="/" replace />} />
        <Route path="/sites/:projectId" element={isAuthenticated ? <Sites /> : <Navigate to="/" replace />} />
        <Route path="/map" element={isAuthenticated ? <MapPage /> : <Navigate to="/" replace />} />
        <Route path="/projects/:projectId" element={isAuthenticated ? <ProjectDetailPage /> : <Navigate to="/" replace />} />
        <Route path="/projects/:projectId/sites/:siteId/analytics" element={isAuthenticated ? <SiteAnalyticsPage /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
