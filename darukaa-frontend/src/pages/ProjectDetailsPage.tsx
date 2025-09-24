import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectDetail } from "@/features/project/components/ProjectDetail";
import { Button } from "@/components/ui/button";
import SiteFormModal from "@/features/sites/components/SiteForm";
import { ApiProject, updateProject } from "@/features/project/api/projectAPI";
import { Site, getSitesByProject, deleteSite } from "@/features/sites/api/sitesAPI";
import park from "@/assets/park.jpg";
import toast from "react-hot-toast";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [showAddSite, setShowAddSite] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      if (!projectId) return;
      try {
        setLoadingSites(true);
        const response = await getSitesByProject(projectId);
        if (response?.sites) {
          setSites(response.sites);
        } else {
          toast.error("No sites found for project");
          setSites([]);
        }
      } catch (err) {
        toast.error("Error fetching sites:", err);
        setSites([]);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [projectId]);

  // Handle save project details
  const handleSaveProject = async (updated: ApiProject) => {
    try {
      await updateProject(updated.p_id, updated);
      toast.success("Project updated successfully");
    } catch (err) {
      toast.error("Failed to update project:", err);
    }
  };

  // Handle remove site
  const handleRemoveSite = async (siteId: string) => {
    if (!window.confirm("Are you sure you want to delete this site?")) return;

    try {
      const response = await deleteSite(siteId);
      if (response) {
        toast.success("site deleted")
        setSites((prev) => prev.filter((s) => s.id !== siteId));
      } else {
        toast.error("Failed to delete site");
      }
    } catch (err) {
      toast.error("Error deleting site:", err);
    }
  };

  // Handle add site
  const handleAddSite = (newSite: Site) => {
    setSites((prev) => [...prev, newSite]);
    setShowAddSite(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 space-y-8">
      {/* Header Section with Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => navigate("/projects")}
          className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-6 py-2.5"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Projects
          </span>
        </Button>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
          <span>Projects</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <span className="text-blue-600 font-medium">Project Details</span>
        </div>
      </div>

      {/* Project editable details */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative">
          <ProjectDetail
            mode="edit"
            projectId={projectId}
            onSave={handleSaveProject}
          />
        </div>
      </div>

      {/* Sites section */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Project Sites
            </h2>
            <p className="text-gray-600">Manage and monitor all sites in this project</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddSite(true)}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add New Site
            </span>
          </Button>
        </div>

        {loadingSites ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 font-medium">Loading sites...</p>
            </div>
          </div>
        ) : sites.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-700">No sites yet</p>
              <p className="text-gray-500">Get started by adding your first site to this project</p>
            </div>
            <Button
              onClick={() => setShowAddSite(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Your First Site
              </span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site, index) => (
              <div
                key={site.id}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col border border-gray-100 hover:scale-[1.02] transform transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Thumbnail with overlay */}
                <div className="relative overflow-hidden">
                  <img
                    src={park}
                    alt={site.name}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Status badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-gray-700">Active</span>
                    </div>
                  </div>
                </div>

                {/* Site Info */}
                <div className="p-6 flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                    {site.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {site.description}
                  </p>
                  {site.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="font-medium">{site.location}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 pt-0">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(
                        `/projects/${projectId}/sites/${site.id}/analytics`
                      )
                    }
                    className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 hover:border-blue-300 font-semibold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      Analytics
                    </span>
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveSite(site.id)}
                    className="bg-gradient-to-r from-red-300 to-rose-100 hover:from-red-100 hover:to-rose-50 text-red-700 border border-red-500 hover:border-red-300 font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Site Modal */}
      {showAddSite && (
        <SiteFormModal
          p_id={projectId}
          onClose={() => setShowAddSite(false)}
        />
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animated-box {
          animation: fadeInUp 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
