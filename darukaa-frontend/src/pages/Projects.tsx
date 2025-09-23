import { useState } from "react";
import { ProjectList } from "@/features/project/components/ProjectList";
import { ProjectDetail } from "@/features/project/components/ProjectDetail";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/features/project/api/useProject";  // ✅ corrected import
import { ApiProject, ProjectCreatePayload } from "@/features/project/api/projectAPI";

export default function Projects() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const { projectsQuery, createProject } = useProjects();

  const handleAddProject = (newProject: ProjectCreatePayload) => {
    createProject.mutate(newProject, {
      onSuccess: () => setShowAddModal(false),
    });
  };

  if (projectsQuery.isLoading) {
    return <div className="p-6">Loading projects...</div>;
  }

  if (projectsQuery.isError) {
    return (
      <div className="p-6 text-red-500">
        Error: {projectsQuery.error?.message}
      </div>
    );
  }

  const projects: ApiProject[] = projectsQuery.data || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          ➕ Add Project
        </Button>
      </div>

      <ProjectList
        projects={projects}
        onViewSites={(project: ApiProject) => {
          navigate(`/sites/${project.p_id}`);
        }}
      />

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
            <ProjectDetail
              mode="add"
              onSave={handleAddProject}
              onClose={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
