import { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface MapViewProps {
  onPolygonDrawn?: (coords: [number, number][]) => void;
  polygons?: [number, number][][]; // multiple saved sites
}

export default function MapView({ onPolygonDrawn, polygons }: MapViewProps) {
  useEffect(() => {
    const map = L.map("map", {
      center: [20.5937, 78.9629],
      zoom: 5,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Feature Group to store drawn + existing items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // ✅ Show saved polygons
    if (polygons && polygons.length > 0) {
      polygons.forEach((coords) => {
        const polygon = L.polygon(coords, { color: "blue" });
        drawnItems.addLayer(polygon);
      });

      // Fit map to bounds of all polygons
      const allLatLngs = polygons.flat().map(([lat, lng]) => L.latLng(lat, lng));
      map.fitBounds(L.latLngBounds(allLatLngs));
    }

    // Add Draw Controls
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        marker: false,
        circle: false,
        circlemarker: false,
        polyline: false,
        rectangle: {},
        polygon: {},
      },
    });
    map.addControl(drawControl);

    // When user finishes drawing
    map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      if (onPolygonDrawn) {
        const coords = layer
          .getLatLngs()[0]
          .map((latlng: any) => [latlng.lat, latlng.lng]) as [number, number][];
        onPolygonDrawn(coords);
      }
    });

    return () => {
      map.remove();
    };
  }, [onPolygonDrawn, polygons]);

  return <div id="map" className="w-full h-full rounded-lg border border-gray-300" />;
}
