import React from "react";
import { SiteList } from "@/features/sites/components/SiteList";
import { useParams } from "react-router-dom";
import { useSites } from "@/features/sites/api/useSites";

export default function SitesPage() {
  const { projectId } = useParams<{ projectId?: string }>();
  const { useSitesByProject, useAllSites } = useSites();

  // Query depending on projectId
const {
  data: projectSitesData = [],
  isLoading: projectLoading,
  isError: projectError,
} = useSitesByProject(projectId);

const {
  data: allSitesData = [],
  isLoading: allLoading,
  isError: allError,
} = useAllSites(0, 20); // only runs if no projectId

const selectedData = projectId ? projectSitesData : allSitesData;
const sites = Array.isArray(selectedData)
  ? selectedData
  : (selectedData && "sites" in selectedData && Array.isArray(selectedData.sites))
    ? selectedData.sites
    : [];

if (projectLoading || allLoading) return <p>Loading...</p>;
if (projectError || allError) return <p>Failed to fetch sites.</p>;


if (projectLoading || allLoading) return <p>Loading...</p>;
if (projectError || allError) return <p>Failed to fetch sites.</p>;

  if (projectId && projectLoading) return <p>Loading project sites...</p>;
  if (!projectId && allLoading) return <p>Loading all sites...</p>;

  if (projectId && projectError)
    return <p className="text-red-500">Failed to load project sites</p>;
  if (!projectId && allError)
    return <p className="text-red-500">Failed to load all sites</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Project Header */}
      {projectId ? (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Project Sites</h1>
          <p className="text-gray-600 mt-2">
            Sites under project <span className="font-medium">{projectId}</span>
          </p>
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Sites</h1>
      )}

      {/* Sites Grid */}
      <SiteList
        sites={sites}
        onViewAnalytics={(site) =>
          console.log("View Analytics clicked for:", site)
        }
      />
    </div>
  );
}
