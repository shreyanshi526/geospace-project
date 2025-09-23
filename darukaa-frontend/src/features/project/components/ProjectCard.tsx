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
    <Card className="rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
      {/* Thumbnail */}
      <img
        src={thumbnail}
        alt={project.name}
        className="w-full h-40 object-cover"
      />

      <CardContent className="p-4 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800">{project.name}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {project.description}
        </p>

        <div className="mt-3 text-sm text-gray-500 space-y-1">
          <p>
            <span className="font-medium">ID:</span> {project.p_id}
          </p>
          <p>
            <span className="font-medium">Added by:</span> {project.created_by}
          </p>
          <p>
            <span className="font-medium">Sites:</span> {project.sites_added_total}
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          {onViewSites && (
            <Button className="flex-1" onClick={() => onViewSites(project)}>
              View Sites
            </Button>
          )}
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate(`/projects/${project.p_id}`)} // ✅ backend id
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
