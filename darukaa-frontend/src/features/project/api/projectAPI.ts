import http from "@/api/axios";

export interface ApiProject {
  p_id: string;
  name: string;
  description?: string;
  sites_added_total: number;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ProjectCreatePayload {
  name: string;
  description?: string;
}

export interface ProjectUpdatePayload {
  name?: string;
  description?: string;
}

export function fetchProjects(
  userId?: string
): Promise<ApiResponse<{ projects: ApiProject[] }>> {
  return http.get<ApiResponse<{ projects: ApiProject[] }>>("/projects", {
    params: userId ? { user_id: userId } : {},
  });
}

export function createProject(
  payload: ProjectCreatePayload
): Promise<ApiResponse<{ project: ApiProject }>> {
  return http.post<ApiResponse<{ project: ApiProject }>>("/projects", payload);
}

export function getProject(
  pId: string
): Promise<ApiResponse<{ project: ApiProject }>> {
  return http.get<ApiResponse<{ project: ApiProject }>>(`/projects/${pId}`);
}

export function updateProject(
  pId: string,
  payload: ProjectUpdatePayload
): Promise<ApiResponse<{ project: ApiProject }>> {
  return http.put<ApiResponse<{ project: ApiProject }>>(
    `/projects/${pId}`,
    payload
  );
}

export function deleteProject(
  pId: string
): Promise<ApiResponse<null>> {
  return http.delete<ApiResponse<null>>(`/projects/${pId}`);
}
