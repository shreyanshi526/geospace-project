import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectDetail } from "@/features/project/components/ProjectDetail";
import { Button } from "@/components/ui/button";
import SiteFormModal from "@/features/sites/components/SiteForm";
import { ApiProject, updateProject } from "@/features/project/api/projectAPI";
import { Site, getSitesByProject, deleteSite } from "@/features/sites/api/sitesAPI"; // ✅ import API
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
          console.warn("No sites found for project:", projectId);
          setSites([]);
        }
      } catch (err) {
        console.error("Error fetching sites:", err);
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
      console.log("Project updated successfully:", updated);
    } catch (err) {
      console.error("Failed to update project:", err);
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
        console.error("Failed to delete site:", response.message);
      }
    } catch (err) {
      console.error("Error deleting site:", err);
    }
  };

  // Handle add site
  const handleAddSite = (newSite: Site) => {
    setSites((prev) => [...prev, newSite]);
    console.log("Added site:", newSite);
    setShowAddSite(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      {/* Back button */}
      <Button variant="secondary" onClick={() => navigate("/projects")}>
        ← Back to Projects
      </Button>

      {/* Project editable details */}
      <ProjectDetail
        mode="edit"
        projectId={projectId}
        onSave={handleSaveProject}
      />

      {/* Sites section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Sites</h2>
          <Button variant="primary" onClick={() => setShowAddSite(true)}>
            + Add Site
          </Button>
        </div>

        {loadingSites ? (
          <p className="text-gray-600">Loading sites...</p>
        ) : sites.length === 0 ? (
          <p className="text-gray-600">
            No sites linked to this project yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <div
                key={site.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
              >
                {/* Thumbnail */}
                <img
                  src={park}
                  alt={site.name}
                  className="h-40 w-full object-cover"
                />

                {/* Site Info */}
                <div className="p-4 flex-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    {site.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {site.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{site.location}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center border-t px-4 py-3 bg-gray-50">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(
                        `/projects/${projectId}/sites/${site.id}/analytics`
                      )
                    }
                  >
                    View Analytics
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveSite(site.id)}
                  >
                    Remove
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
          mode="add"
          onClose={() => setShowAddSite(false)}
          onSubmit={handleAddSite}
        />
      )}
    </div>
  );
}
