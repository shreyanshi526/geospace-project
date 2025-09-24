import http from "@/api/axios";


export interface AnalyticsMetric {
  value: number;
  unit: string;
}

export interface SiteAnalytics {
  [metric: string]: AnalyticsMetric;
}

export interface Site {
  id: string;
  name: string;
  description?: string;
  area?: number;
  location?: string;
  geolocation?: { lat: number; lon: number; }[];
  analytics?: SiteAnalytics;

  project_id: string;
  created_by: string;
  updated_by?: string;

  created_at: string;
  updated_at: string;
}
export interface sites {
  id: string;
  name: string;
  description?: string;
  area?: number;
  location?: string;
  geolocation?: { lat: number; lon: number; }[];
  analytics?: SiteAnalytics;

  project_id: string;
  created_by: string;
  updated_by?: string;

  created_at: string;
  updated_at: string;
}

export interface SiteCreatePayload {
  name: string;
  description?: string;
  area?: number;
  location?: string;
  geolocation?: { lat: number; lon: number; }[];
  project_id: string;
  analytics?: SiteAnalytics;
}

export interface SiteUpdatePayload {
  name?: string;
  description?: string;
  area?: number;
  location?: string;
  geolocation?: { lat: number; lon: number; }[];
  analytics?: SiteAnalytics;
}

export interface ApiResponse<T = any> {
  sites: any;
  chart: any;
  site: any;
  success: boolean;
  message: string;
  data?: T;
}



export async function createSite(
  payload: SiteCreatePayload
): Promise<ApiResponse<{ site: Site }>> {
  const { data } = await http.post("/sites", payload);
  return data;
}

export async function updateSite(
  siteId: string,
  payload: SiteUpdatePayload
): Promise<ApiResponse<{ site: Site }>> {
  const { data } = await http.put(`/sites/${siteId}`, payload);
  return data;
}

export async function deleteSite(siteId: string): Promise<ApiResponse<null>> {
  const { data } = await http.delete(`/sites/${siteId}`);
  return data;
}

export async function getSite(
  siteId: string
): Promise<ApiResponse<{ site: Site }>> {
  const { data } = await http.get(`/sites/${siteId}`);
  return data;
}

export async function getSitesByProject(
  projectId: string
): Promise<ApiResponse<{ sites: Site[] }>> {
  const { data } = await http.get(`/sites/project/${projectId}`);
  return data;
}

export async function getSitesByUser(
  userId: string
): Promise<ApiResponse<{ sites: Site[] }>> {
  const { data } = await http.get(`/sites/user/${userId}`);
  return data;
}


export interface SiteAnalyticsHistoryEntry {
  id: string;
  site_id: string;
  project_id: string;
  analytics: SiteAnalytics;
  created_by: string;
  created_at: string;
}

export async function getSiteAnalyticsHistory(
  siteId: string
): Promise<ApiResponse<{
  chart: any; history: SiteAnalyticsHistoryEntry[] 
}>> {
  const { data } = await http.get(`/sites/${siteId}/analytics/history`);
  return data;
}


export async function getAllSites(
  skip = 0,
  limit = 10
): Promise<ApiResponse<{ sites: Site[] }>> {
  const { data } = await http.get(`/sites/all?skip=${skip}&limit=${limit}`);
  return data;
}
