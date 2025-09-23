import React, { useEffect, useState } from "react";
import { ApiProject } from "../api/projectAPI";
import { Button } from "@/components/ui/button";
import { useGetProject } from "../api/useProject";

interface ProjectDetailProps {
  mode: "add" | "edit";
  projectId?: string;
  onSave: (updated: ApiProject) => void;
  onClose?: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  mode,
  projectId,
  onSave,
  onClose,
}) => {
  const { data: fetchedProject, isLoading, error } = useGetProject(projectId);

  const [form, setForm] = useState<any>({
    project_id: "",
    name: "",
    description: "",
    added_by: "Admin User",
    total_sites: 0,
    thumbnail: "https://source.unsplash.com/400x200/?project",
  });

  useEffect(() => {
    if (mode === "edit" && fetchedProject) {
      setForm(fetchedProject);
    }
  }, [mode, fetchedProject]);

  const handleChange = (field: keyof ApiProject, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  if (mode === "edit" && isLoading) {
    return <p className="text-center text-gray-500">Loading project...</p>;
  }

  if (mode === "edit" && error) {
    return (
      <p className="text-center text-red-500">
        Failed to load project: {error.message}
      </p>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {mode === "add" ? "Add New Project" : "Edit Project"}
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 p-2"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 p-2"
            rows={3}
            placeholder="Enter project description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {mode === "edit" && (
            <div>
              
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Total Sites
            </label>
            <input
              type="number"
              value={form.total_sites}
              disabled
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button className="flex-1" onClick={handleSave}>
          {mode === "add" ? "Create Project" : "Save Changes"}
        </Button>
        {onClose && (
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
