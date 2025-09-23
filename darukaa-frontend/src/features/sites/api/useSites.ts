// src/hooks/useSites.ts
import { useQuery, useMutation, useQueryClient, QueryKey, UseQueryOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createSite,
  updateSite,
  deleteSite,
  getSite,
  getSitesByProject,
  getSitesByUser,
  getAllSites,
  getSiteAnalyticsHistory,
  Site,
  SiteCreatePayload,
  SiteUpdatePayload,
  ApiResponse,
  SiteAnalyticsHistoryEntry,
} from "./sitesAPI";

// Query key for caching
const SITES_KEY: QueryKey = ["sites"];

export function useSites() {
  const queryClient = useQueryClient();

  // --- Mutations ---
  const createMutation = useMutation<ApiResponse<{ site: Site }>, Error, SiteCreatePayload>({
    mutationFn: createSite,
    onSuccess: () => {
      toast.success("Site created successfully!");
      queryClient.invalidateQueries({ queryKey: SITES_KEY });
    },
    onError: (err) => toast.error(err.message || "Failed to create site"),
  });

  const updateMutation = useMutation<
    ApiResponse<{ site: Site }>,
    Error,
    { siteId: string; payload: SiteUpdatePayload }
  >({
    mutationFn: ({ siteId, payload }) => updateSite(siteId, payload),
    onSuccess: () => {
      toast.success("Site updated successfully!");
      queryClient.invalidateQueries({ queryKey: SITES_KEY });
    },
    onError: (err) => toast.error(err.message || "Failed to update site"),
  });

  const deleteMutation = useMutation<ApiResponse<null>, Error, string>({
    mutationFn: deleteSite,
    onSuccess: () => {
      toast.success("Site deleted successfully!");
      queryClient.invalidateQueries({ queryKey: SITES_KEY });
    },
    onError: (err) => toast.error(err.message || "Failed to delete site"),
  });

  // --- Queries ---
  const useSite = (siteId: string) =>
    useQuery<Site, Error>({
      queryKey: ["site", siteId],
      queryFn: async () => {
        const res: ApiResponse<{ site: Site }> = await getSite(siteId);
        return res.data.site;
      },
      enabled: !!siteId,
    });


  const useSitesByUser = (userId: string) =>
    useQuery<Site[], Error>({
      queryKey: ["sites", "user", userId],
      queryFn: async () => {
        const res: ApiResponse<{ sites: Site[] }> = await getSitesByUser(userId);
        return res.data.sites;
      },
      enabled: !!userId,
    });

  const useSitesByProject = (
    projectId: string | undefined,
    options?: UseQueryOptions<ApiResponse<{ sites: Site[] }>, Error>
  ) =>
    useQuery<ApiResponse<{ sites: Site[] }>, Error>({
      queryKey: ["sites", "project", projectId],
      queryFn: () => getSitesByProject(projectId!),
      enabled: !!projectId,   // default
      ...options,             // ✅ allow overrides
    });

  const useAllSites = (
    skip = 0,
    limit = 10,
    options?: UseQueryOptions<ApiResponse<{ sites: Site[] }>, Error>
  ) =>
    useQuery<ApiResponse<{ sites: Site[] }>, Error>({
      queryKey: ["sites", "all", skip, limit],
      queryFn: () => getAllSites(skip, limit),
      ...options,             // ✅ allow overrides
    });


  const useSiteAnalyticsHistory = (siteId: string) =>
    useQuery<SiteAnalyticsHistoryEntry[], Error>({
      queryKey: ["sites", siteId, "analytics", "history"],
      queryFn: async () => {
        const res: ApiResponse<{ history: SiteAnalyticsHistoryEntry[] }> =
          await getSiteAnalyticsHistory(siteId);
        return res.data.history;
      },
      enabled: !!siteId,
    });

  return {
    // Queries
    useSite,
    useSitesByProject,
    useSitesByUser,
    useAllSites,
    useSiteAnalyticsHistory,

    // Mutations
    createSite: createMutation,
    updateSite: updateMutation,
    deleteSite: deleteMutation,
  };
}
