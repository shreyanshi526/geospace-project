import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ApiProject } from "../api/projectAPI";
import thumbnail from '@/assets/forest.jpg'

interface ProjectCardProps {
  project: ApiProject;
  onViewSites?: (project: ApiProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewSites }) => {
  const navigate = useNavigate();

  return (
    <Card className="group rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 hover:scale-[1.02] transform">
      {/* Thumbnail with overlay */}
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={project.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Floating badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            {project.sites_added_total} Sites
          </span>
        </div>
      </div>

      <CardContent className="p-6 flex flex-col space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
            {project.name}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-3 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Project ID
            </span>
            <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-xs">
              {project.p_id}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Created by
            </span>
            <span className="font-medium text-gray-700 flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {project.created_by}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {onViewSites && (
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200" 
              onClick={() => onViewSites(project)}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                View Sites
              </span>
            </Button>
          )}
          <Button
            variant="secondary"
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200"
            onClick={() => navigate(`/projects/${project.p_id}`)}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Details
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
