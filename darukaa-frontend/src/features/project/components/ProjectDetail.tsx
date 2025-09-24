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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (mode === "edit" && error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-red-700 font-semibold mb-2">Failed to load project</p>
          <p className="text-red-600 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-8 max-w-2xl mx-auto backdrop-blur-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          {mode === "add" ? "Add New Project" : "Edit Project"}
        </h1>
        <p className="text-gray-500 text-sm">
          {mode === "add" ? "Create a new project to get started" : "Update your project details"}
        </p>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
            Project Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none hover:border-gray-300"
            placeholder="Enter a descriptive project name"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none hover:border-gray-300 resize-none"
            rows={4}
            placeholder="Provide a detailed description of your project goals and scope"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mode === "edit" && (
            <div>
              
            </div>
          )}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Sites
            </label>
            <div className="relative">
              <input
                type="number"
                value={form.total_sites}
                disabled
                className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 text-gray-500 cursor-not-allowed"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Automatically calculated</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200" onClick={handleSave}>
          <span className="flex items-center justify-center gap-2">
            {mode === "add" ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Create Project
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save Changes
              </>
            )}
          </span>
        </Button>
        {onClose && (
          <Button 
            variant="secondary" 
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200" 
            onClick={onClose}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancel
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};
