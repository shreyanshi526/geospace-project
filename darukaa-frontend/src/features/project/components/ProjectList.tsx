import React from "react";
import { ApiProject } from "../api/projectAPI";  // ✅ use backend type
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: ApiProject[];
  onViewSites?: (project: ApiProject) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onViewSites,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.p_id}   // ✅ backend field
          project={project}
          onViewSites={onViewSites}
        />
      ))}
    </div>
  );
};
