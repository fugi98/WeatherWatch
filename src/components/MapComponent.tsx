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

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, location, satelliteView, savedLocations }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      // Initialize map if not already initialized
      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current, {
          center: center,
          zoom: zoom,
          layers: [
            L.tileLayer(satelliteView ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
          ],
        });
      } else {
        // Update existing map instance
        mapInstance.current.setView(center, zoom);
        // Update satellite view
        mapInstance.current.eachLayer((layer) => {
          mapInstance.current?.removeLayer(layer);
        });
        L.tileLayer(satelliteView ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
      }

      // Define custom icon
      const customIcon = L.icon({
        iconUrl: '/images/custom-marker-icon.png',
        iconRetinaUrl: '/images/custom-marker-icon.png',
        shadowUrl: '/images/custom-marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Add markers for saved locations with custom icon
      savedLocations.forEach(([lat, lon]) => {
        L.marker([lat, lon], { icon: customIcon }).addTo(mapInstance.current!);
      });

      // Add marker for current location
      L.marker(center, { icon: customIcon }).addTo(mapInstance.current!);

      // Cleanup function to remove map instance
      return () => {
        if (mapInstance.current) {
          mapInstance.current.off();
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    }
  }, [center, zoom, satelliteView, savedLocations]);

  return <div className='relative' ref={mapRef} style={{ height: '100%', zIndex: 1 }}></div>;
};

export default MapComponent;
