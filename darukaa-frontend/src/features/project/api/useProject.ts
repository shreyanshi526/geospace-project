// src/api/useProjects.ts
import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  getProject,
  ApiProject,
  ProjectCreatePayload,
  ProjectUpdatePayload,
  ApiResponse,
} from "./projectAPI";

const PROJECTS_KEY: QueryKey = ["projects"];

export function useProjects(userId?: string) {
  const queryClient = useQueryClient();

  // ✅ return backend objects directly
  const projectsQuery = useQuery<ApiProject[], Error>({
    queryKey: [...PROJECTS_KEY, userId],
    queryFn: async () => {
      const res: ApiResponse<{ projects: ApiProject[] }> = await fetchProjects(userId);
      return res.data?.projects || [];
    },
  });

  const createMutation = useMutation<ApiProject, Error, ProjectCreatePayload>({
    mutationFn: async (payload) => {
      const res: ApiResponse<{ project: ApiProject }> = await createProject(payload);
      if (!res.data?.project) throw new Error("Failed to create project");
      return res.data.project;
    },
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create project");
    },
  });

  const updateMutation = useMutation<ApiProject, Error, { pId: string; payload: ProjectUpdatePayload }>({
    mutationFn: async ({ pId, payload }) => {
      const res: ApiResponse<{ project: ApiProject }> = await updateProject(pId, payload);
      if (!res.data?.project) throw new Error("Failed to update project");
      return res.data.project;
    },
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update project");
    },
  });

  const deleteMutation = useMutation<ApiResponse<null>, Error, string>({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete project");
    },
  });

  return {
    projectsQuery,
    createProject: createMutation,
    updateProject: updateMutation,
    deleteProject: deleteMutation,
  };
}

export function useGetProject(pId: string) {
  return useQuery<ApiProject, Error>({
    queryKey: ["project", pId],
    queryFn: async () => {
      const res: ApiResponse<{ project: ApiProject }> = await getProject(pId);
      if (!res.data?.project) throw new Error("Project not found");
      return res.data.project;
    },
    enabled: !!pId,
  });
}
