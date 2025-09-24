import React, { useState } from "react";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MapView from "@/features/map/components/MapView";
import { Save, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createSite,
  SiteCreatePayload,
  Site,
  ApiResponse,
} from "@/features/sites/api/sitesAPI";
import { SITES_KEY } from '@/features/sites/api/useSites'
import { useParams } from "react-router-dom";

interface SiteFormProps {
  p_id: string,
  onClose: () => void;
}

export default function SiteForm({ p_id, onClose }: SiteFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [polygon, setPolygon] = useState<[number, number][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation<
    ApiResponse<{ site: Site }>,
    Error,
    SiteCreatePayload
  >({
    mutationFn: createSite,
    onSuccess: () => {
      toast.success("Site created successfully!");
      queryClient.invalidateQueries({ queryKey: ['projects', p_id] });
      onClose();
    },
    onError: (err) => toast.error(err.message || "Failed to create site"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dummyAnalytics = {
      "Air Quality Index": { value: 72, unit: "AQI" },
      "Avg. Temperature": { value: 28, unit: "°C" },
      "Rainfall": { value: 15, unit: "mm" },
      "Soil Moisture": { value: 42, unit: "%" },
      "Vegetation Index": { value: 0.65, unit: "NDVI" },
    };

    const payload: SiteCreatePayload = {
      name,
      description,
      project_id: p_id, // You can make this dynamic if needed
      area: parseFloat(area) || 0,
      location: location || "Unknown",
      geolocation: polygon.map(([lat, lon]) => ({ lat, lon })),
      analytics: dummyAnalytics,
    };

    createMutation.mutate(payload);
  };

  const handlePolygonUpdate = (coords: [number, number][]) => {
    setPolygon(coords);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Add Site</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Site Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter site name"
          />

          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />

          <Input
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="e.g., Wetland, Forest, River Basin"
          />

          <Input
            label="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g., 100.5"
          />

          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
          />

          <div className="flex justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(true)}
            >
              Add Boundary
            </Button>

            <div className="flex space-x-3">
              <Button variant="secondary" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Add Site
              </Button>
            </div>
          </div>
        </form>

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Edit Site Boundary"
          >
            <div className="w-full h-[70vh] flex flex-col gap-4">
              <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
                <MapView
                  polygons={
                    polygon.length > 0
                      ? [polygon.map(([lat, lon]) => ({ lat, lon }))]
                      : undefined
                  }
                  onPolygonDrawn={handlePolygonUpdate}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
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
