import { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

type PolygonPoint = { lat: number; lon: number };
type PolygonData = PolygonPoint[];

interface MapViewProps {
  onPolygonDrawn?: (coords: [number, number][]) => void;
  polygons?: PolygonData[]; // optional: preload polygons (for edit mode)
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

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

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

    // ✅ If polygons are passed (edit mode), preload them
    if (polygons && polygons.length > 0) {
      polygons.forEach((polygon) => {
        const coords: [number, number][] = polygon.map((p) => [p.lat, p.lon]);
        const leafletPolygon = L.polygon(coords, { color: "blue" });
        drawnItems.addLayer(leafletPolygon);
      });

      // Fit map to all polygons
      const allLatLngs = polygons.flat().map((p) => L.latLng(p.lat, p.lon));
      if (allLatLngs.length > 0) {
        map.fitBounds(L.latLngBounds(allLatLngs));
      }
    }

    // ✅ Handle new polygon creation
    map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      const coords = layer
        .getLatLngs()[0]
        .map((latlng: any) => [latlng.lat, latlng.lng]) as [number, number][];

      if (onPolygonDrawn) {
        onPolygonDrawn(coords);
      }
    });

    // ✅ Handle polygon edits
    map.on(L.Draw.Event.EDITED, (event: any) => {
      event.layers.eachLayer((layer: any) => {
        const latLngs = layer.getLatLngs();
        let coords: [number, number][] = [];

        if (Array.isArray(latLngs) && latLngs.length > 0) {
          const coordsArray = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;
          coords = coordsArray.map(
            (latlng: any) => [latlng.lat, latlng.lng] as [number, number]
          );
        }

        if (coords.length > 0 && onPolygonDrawn) {
          onPolygonDrawn(coords);
        }
      });
    });

    // ✅ Handle polygon deletions
    map.on(L.Draw.Event.DELETED, () => {
      if (onPolygonDrawn) {
        onPolygonDrawn([]); // return empty coords if deleted
      }
    });

    return () => {
      map.remove();
    };
  }, [onPolygonDrawn, polygons]);

  return (
    <div
      id="map"
      className="w-full h-full rounded-lg border border-gray-300"
    />
  );
}
