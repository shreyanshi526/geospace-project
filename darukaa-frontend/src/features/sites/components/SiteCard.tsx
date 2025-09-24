import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Site } from "@/features/sites/api/sitesAPI";
import park from '@/assets/park.jpg'

interface SiteCardProps {
  site: Site;
  onViewAnalytics?: (site: Site) => void;
  extraContent?: ReactNode;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  onViewAnalytics,
  extraContent,
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>(); 
  return (
    <Card className="group rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-slate-50 border-0 hover:scale-[1.02] transform">
      {/* Image with overlay effects */}
      <div className="relative overflow-hidden">
        <img
          src={park}
          alt={site.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-gray-700">Active</span>
            </div>
          </div>
        </div>

        {/* Location badge */}
        {site.location && (
          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="text-xs font-medium text-white flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {site.location}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-6 flex flex-col space-y-4">
        {/* Header Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-1">
            {site.name}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {site.description}
          </p>
        </div>

        {/* Metadata Section */}
        <div className="space-y-3 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Site ID
            </span>
            <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
              {site.id}
            </span>
          </div>

          {site.location && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Location
              </span>
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {site.location}
              </span>
            </div>
          )}
        </div>

        {/* Extra Content */}
        {extraContent && (
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100">
            {extraContent}
          </div>
        )}

        {/* Analytics Button */}
        {onViewAnalytics && (
          <div className="pt-2">
            <Button
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              onClick={() =>
                navigate(
                  `/projects/${projectId || site.project_id}/sites/${site.id}/analytics`
                )
              }
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                View Analytics
              </span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
