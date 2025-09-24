import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Save, MapPin, Calendar } from "lucide-react";
import KPI from "@/features/analytics/components/KPI";
import { MultiChart } from "@/components/charts";
import type { MultiChartData } from "@/components/charts";
import {
  getSiteAnalyticsHistory,
  getSite,
  updateSite,
} from "@/features/sites/api/sitesAPI";
import Modal from "@/components/ui/Modal";
import MapView from "@/features/map/components/MapView";
import { Button } from "@/components/ui/button";

export default function SiteAnalyticsPage() {
  const { projectId, siteId } = useParams();
  const [loading, setLoading] = useState(true);
  const [siteDetails, setSiteDetails] = useState<any>(null);

  const [metrics, setMetrics] = useState<
    { label: string; value: number; unit: string }[]
  >([]);

  const [chartData, setChartData] = useState<MultiChartData>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [polygon, setPolygon] = useState<{ lat: number; lon: number }[][]>([]);

  const handlePolygonUpdate = (coords: [number, number][]) => {
    const formatted = coords.map((point: any) => {
      if (Array.isArray(point) && point.length === 2) {
        const [lat, lng] = point;
        return { lat, lon: lng };
      } else if (typeof point === "object" && point.lat !== undefined && point.lon !== undefined) {
        return { lat: point.lat, lon: point.lon };
      }
      return null;
    }).filter(Boolean);

    setPolygon([formatted]);
  };

  useEffect(() => {
    async function fetchData() {
      if (!siteId || !projectId) return;
      setLoading(true);

      try {
        const siteRes = await getSite(siteId);
        if (siteRes.site) {
          const site = siteRes.site;
          setSiteDetails(site);
          handlePolygonUpdate(site.geolocation)
          if (site.analytics) {
            const siteMetrics = Object.entries(site.analytics).map(
              ([label, val]: any) => ({
                label,
                value: val.value,
                unit: val.unit,
              })
            );
            setMetrics(siteMetrics);
          }
        }

        const analyticsRes = await getSiteAnalyticsHistory(siteId);
        if (analyticsRes.chart) {
          setChartData(analyticsRes.chart);
        }
      } catch (error) {
        console.error("Error fetching site data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId, siteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading site analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Analytics</h1>
            <p className="text-gray-600 mt-1">Monitor and manage site performance</p>
          </div>
        </div>

        {siteDetails && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Site Details
              </h2>
            </div>
            <div className="p-6">
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const updatedSite = {
                    ...siteDetails,
                    name: (e.target as any).name.value,
                    description: (e.target as any).description.value,
                    location: (e.target as any).location.value,
                    type: (e.target as any).type.value,
                    area: Number((e.target as any).area.value),
                    status: (e.target as any).status.checked ? "Active" : "Inactive",
                    geolocation: polygon[0]?.length ? polygon[0] : siteDetails.geolocation,
                  };
                  setSiteDetails(updatedSite);
                }}
              >
                {/* Site ID - Read only */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Site Information</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Site ID:</span>
                      <p className="text-gray-900 font-mono">{siteDetails.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Date Added:</span>
                      <p className="text-gray-900">{new Date(siteDetails.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Last Updated:</span>
                      <p className="text-gray-900">{new Date(siteDetails.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name *
                    </label>
                    <input
                      name="name"
                      defaultValue={siteDetails.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      name="location"
                      defaultValue={siteDetails.location}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      name="description"
                      defaultValue={siteDetails.description || ""}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Type
                    </label>
                    <input
                      name="type"
                      defaultValue={siteDetails.type || ""}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area (km²) *
                    </label>
                    <input
                      name="area"
                      type="number"
                      step="any"
                      defaultValue={siteDetails.area}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="status"
                          defaultChecked={siteDetails.status === "Active"}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <span className={`font-medium ${siteDetails.status === "Active" ? "text-green-600" : "text-gray-500"}`}>
                        {siteDetails.status === "Active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Geolocation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Geolocation Coordinates
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2 text-sm font-mono text-gray-700">
                      {polygon[0]?.length
                        ? polygon[0].map((p, i) => (
                          <span key={i} className="bg-white px-2 py-1 rounded border">
                            [{p.lat.toFixed(6)}, {p.lon.toFixed(6)}]
                          </span>
                        ))
                        : siteDetails.geolocation?.lat && siteDetails.geolocation?.lon
                          ? <span className="bg-white px-2 py-1 rounded border">
                            [{siteDetails.geolocation.lat.toFixed(6)}, {siteDetails.geolocation.lon.toFixed(6)}]
                          </span>
                          : <span className="text-gray-500">No coordinates available</span>}
                    </div>
                    <Button
                      variant="secondary"
                      className="mt-3"
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <MapPin className="w-4 h-4" />
                      View / Edit Site Boundary
                    </Button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button
                  type="submit"
                  variant="primary"
                  onClick={async (e) => {
                    e.preventDefault();
                    const form = (e.target as HTMLElement).closest("form") as HTMLFormElement;
                    if (!form) return;
                    const updatedSite = {
                    ...siteDetails,
                    name: (form as any).name.value,
                    description: (form as any).description.value,
                    location: (form as any).location.value,
                    type: (form as any).type.value,
                    area: Number((form as any).area.value),
                    status: (form as any).status.checked ? "Active" : "Inactive",
                    geolocation: polygon[0]?.length ? polygon[0] : siteDetails.geolocation,
                    };
                    try {
                    await updateSite(siteDetails.id, updatedSite);
                    setSiteDetails(updatedSite);
                    } catch (err) {
                    console.error("Failed to update site", err);
                    }
                  }}
                  >
                  <Save className="w-4 h-4" />
                  Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((m) => (
            <KPI key={m.label} label={m.label} value={m.value} unit={m.unit} />
          ))}
        </div>

        {/* Chart */}
        <MultiChart
          data={chartData}
          title="Environmental Analytics"
          chartType="line"
          showArea={true}
          height={400}
        />

        {/* Boundary modal */}
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Edit Site Boundary"
          >
            <div className="w-full h-[70vh] flex flex-col gap-4">
              <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
                <MapView polygons={polygon} onPolygonDrawn={handlePolygonUpdate} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  <Save className="w-4 h-4" />
                  Save Boundary
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}