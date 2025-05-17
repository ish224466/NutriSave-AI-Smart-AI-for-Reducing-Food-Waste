import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate }from 'react-router-dom';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});



const NearbyRequests = () => {
  const [donations, setDonations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  // Get user geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  }, []);

  // Fetch donations and sort by distance
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await axios.get('http://localhost:5001/api/donations/give', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pending = res.data.filter((d) => d.status === 'pending');

        if (userLocation) {
          pending.sort((a, b) => {
            const distA = getDistance(userLocation, a.location);
            const distB = getDistance(userLocation, b.location);
            return distA - distB;
          });
        }

        setDonations(pending);
      } catch (err) {
        console.error('Error fetching donations:', err);
      }
    };

    if (userLocation) fetchDonations();
  }, [userLocation]);

  const getDistance = (loc1, loc2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(loc1.lat)) *
        Math.cos(toRad(loc2.lat)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleClaim = async (donationId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await axios.patch(
        `http://localhost:5001/api/donations/${donationId}/claim`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Donation claimed successfully!');
      setDonations((prev) => prev.filter((d) => d._id !== donationId));
    } catch (err) {
      console.error('Error claiming donation:', err);
      setMsg('Error claiming donation.');
    }
  };

  return (
    <Box sx={{ mt: 6, px: 4 }}>
      <Typography variant="h5" gutterBottom>
        Nearby Donation Requests
      </Typography>

      {msg && <Typography color="success.main">{msg}</Typography>}

      {userLocation && (
        <Box sx={{ mb: 3 }}>
          <Typography>Your Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</Typography>
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ height: '300px', width: '100%', marginTop: '12px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Location</Popup>
            </Marker>
            {donations.map((don) => (
              <Marker
                key={don._id}
                position={[don.location.lat, don.location.lng]}
              >
                <Popup>{don.foodName} ({don.quantity})</Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      )}

      <Typography variant="h6" gutterBottom>
        Predict Food Expiry 
        </Typography>
<Button variant="contained" onClick={() => navigate('/form')}>Predict</Button>

      
      <Typography variant="h6" gutterBottom>
        Donation Requests
      </Typography>
      {donations.length === 0 ? (
        <Typography>No nearby donation requests.</Typography>
      ) : (
        donations.map((donation) => (
          <Box
            key={donation._id}
            sx={{
              border: '1px solid #ddd',
              p: 2,
              mb: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography><strong>Food:</strong> {donation.foodName}</Typography>
            <Typography><strong>Quantity:</strong> {donation.quantity}</Typography>
            <Typography><strong>Expires:</strong> {donation.predictedExpiry}</Typography>
            <Typography><strong>Distance:</strong> {userLocation ? getDistance(userLocation, donation.location).toFixed(2) : '...'} km</Typography>
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => handleClaim(donation._id)}
            >
              Accept Request
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

export default NearbyRequests;
