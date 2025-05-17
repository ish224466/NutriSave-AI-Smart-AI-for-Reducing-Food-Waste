import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function MapView() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/donations`);
      setDonations(res.data);
    };
    fetchDonations();
  }, []);

  return (
    <div className="mt-6">
      <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-[400px] w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {donations.map((d) => (
          <Marker
            key={d._id}
            position={[d.location.lat, d.location.lng]}
          >
            <Popup>
              <strong>{d.foodName}</strong><br />
              Quantity: {d.quantity}<br />
              Expiry: {d.predictedExpiry || 'N/A'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;
