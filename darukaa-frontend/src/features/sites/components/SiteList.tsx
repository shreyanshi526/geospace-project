import React from "react";
import { Site } from "@/features/sites/api/sitesAPI";
import { SiteCard } from "./SiteCard";

interface SiteListProps {
  sites: any[] | { sites: any[] };
  onViewAnalytics?: (site: Site) => void;
}

export const SiteList: React.FC<SiteListProps> = ({ sites, onViewAnalytics }) => {
  const normalizedSites = Array.isArray(sites) ? sites : sites?.sites || [];

  console.log(normalizedSites, "normalizedSites");

  if (normalizedSites.length === 0) {
    return <p className="text-gray-500">No sites available</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {normalizedSites.map((site) => (
        <SiteCard key={site.id} site={site} onViewAnalytics={onViewAnalytics} />
      ))}
    </div>
  );
};

