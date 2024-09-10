import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  location: string;
  satelliteView: boolean;
  savedLocations: [number, number][];
  className: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, satelliteView, savedLocations }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      if (!mapInstance.current) {
        // Initialize map with default settings
        mapInstance.current = L.map(mapRef.current, {
          center: center,
          zoom: zoom,
          layers: [
            L.tileLayer(
              satelliteView
                ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ),
          ],
        });
      } else {
        // Update map view and layers
        mapInstance.current.setView(center, zoom);

        mapInstance.current.eachLayer((layer) => {
          mapInstance.current?.removeLayer(layer);
        });

        L.tileLayer(
          satelliteView
            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ).addTo(mapInstance.current);
      }

      // Define custom icon for markers
      const customIcon = L.icon({
        iconUrl: '/images/custom-marker-icon.png',
        iconRetinaUrl: '/images/custom-marker-icon.png',
        shadowUrl: '/images/custom-marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // Clear existing markers
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstance.current?.removeLayer(layer);
        }
      });

      // Add markers for saved locations and current location
      savedLocations.forEach(([lat, lon]) => {
        L.marker([lat, lon], { icon: customIcon }).addTo(mapInstance.current!);
      });

      // Add marker for the current location
      L.marker(center, { icon: customIcon }).addTo(mapInstance.current!);

      // Cleanup on unmount
      return () => {
        if (mapInstance.current) {
          mapInstance.current.off();
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    }
  }, [center, zoom, satelliteView, savedLocations]);

  return <div className="relative" ref={mapRef} style={{ height: '100%', zIndex: 1 }}></div>;
};

export default MapComponent;
