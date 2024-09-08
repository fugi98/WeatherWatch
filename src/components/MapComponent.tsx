import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';

// Define your custom icon here
const customIcon = L.icon({
  iconUrl: '/images/custom-marker-icon.png',
  iconRetinaUrl: '/images/custom-marker-icon.png',
  shadowUrl: '/images/custom-marker-shadow.png'
});

interface MapProps {
  center: LatLngExpression;
  zoom: number;
  location: string;
}

const MapComponent: React.FC<MapProps> = ({ center, zoom, location }) => {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={customIcon}>
        <Popup>
          <div className="text-black">
            <p className="font-bold">{location}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
