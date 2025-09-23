import React, { useState } from "react";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MapView from "@/features/map/components/MapView";
import { X } from "lucide-react";

interface SiteFormProps {
  mode: "add" | "edit";
  initialData?: {
    name: string;
    description: string;
    type: string;
    area: string;
    polygon: [number, number][];
  };
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export default function SiteForm({
  mode,
  initialData,
  onSubmit,
  onClose,
}: SiteFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [type, setType] = useState(initialData?.type || "");
  const [area, setArea] = useState(initialData?.area || "");
  const [polygon, setPolygon] = useState<[number, number][]>(
    initialData?.polygon || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, type, area, polygon });
    onClose(); // close after submit
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

        <h2 className="text-xl font-bold mb-4">
          {mode === "add" ? "Add Site" : "Edit Site"}
        </h2>

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
            placeholder="e.g., 12.5 km²"
          />

          {/* Map Picker */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Select Area on Map
            </p>
            <MapView
              onPolygonDrawn={(coords: [number, number][]) => setPolygon(coords)}
            />
            {polygon.length > 0 && (
              <p className="text-xs text-green-600 mt-2">
                Polygon with {polygon.length} points selected.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {mode === "add" ? "Add Site" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
