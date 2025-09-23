import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import KPI from "@/features/analytics/components/KPI";
import ChartContainer from "@/features/analytics/components/ChartContainer";
import TimeSeriesChart from "@/features/analytics/components/TimeSeriesChart";
import {
  getSiteAnalyticsHistory,
  getSite,
} from "@/features/sites/api/sitesAPI"; 

export default function SiteAnalyticsPage() {
  const { projectId, siteId } = useParams();
  const [loading, setLoading] = useState(true);
  const [siteDetails, setSiteDetails] = useState<any>(null);
  const [metrics, setMetrics] = useState<
    { label: string; value: number; unit: string }[]
  >([]);
  const [timeSeriesData, setTimeSeriesData] = useState<
    { date: string; value: number }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      if (!siteId || !projectId) return;
      setLoading(true);

      try {
        // 🔹 Fetch site details
        const siteRes = await getSite(siteId);
        if (siteRes.site) {
          const site = siteRes.site;
          setSiteDetails(site);

          // Use analytics snapshot from site if available
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

        // 🔹 Fetch analytics history
        const analyticsRes = await getSiteAnalyticsHistory(siteId);
        if (analyticsRes.chart) {
          // Time series (AQI trend as example)
          const aqiChart = analyticsRes.chart["Air Quality Index"]?.values || [];
          setTimeSeriesData(
            aqiChart.map((p: any) => ({
              date: p.x,
              value: p.y,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching site data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId, siteId]);
console.log(timeSeriesData,"metrics")
  if (loading) {
    return <p className="p-6">Loading site analytics...</p>;
  }
  return (
    <div className="p-6 space-y-8">
      {/* 🔹 Site Details Section */}
      {siteDetails && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Site Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <span className="font-medium">Site ID:</span> {siteDetails.id}
            </p>
            <p>
              <span className="font-medium">Name:</span> {siteDetails.name}
            </p>
            <p>
              <span className="font-medium">Description:</span>{" "}
              {siteDetails.description || "—"}
            </p>
            <p>
              <span className="font-medium">Location:</span>{" "}
              {siteDetails.location}
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              {siteDetails.type || "—"}
            </p>
            <p>
              <span className="font-medium">Area:</span> {siteDetails.area} km²
            </p>
            <p>
              <span className="font-medium">Geolocation:</span>{" "}
              {siteDetails.geolocation?.lat}, {siteDetails.geolocation?.lon}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              {siteDetails.status || "Active"}
            </p>
            <p>
              <span className="font-medium">Date Added:</span>{" "}
              {new Date(siteDetails.created_at).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Last Updated:</span>{" "}
              {new Date(siteDetails.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* 🔹 Current Environmental Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <KPI key={m.label} label={m.label} value={m.value} unit={m.unit} />
        ))}
      </div>

      {/* 🔹 Time Series Data (example: AQI trend) */}
      <ChartContainer title="Air Quality Index Over Time">
        <TimeSeriesChart data={timeSeriesData} />
      </ChartContainer>
    </div>
  );
}
