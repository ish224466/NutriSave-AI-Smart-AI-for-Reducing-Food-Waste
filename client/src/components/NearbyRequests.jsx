import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NearbyRequests = () => {
  const [donations, setDonations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [msg, setMsg] = useState('');

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  }, []);

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await axios.get('http://localhost:5001/api/donations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Filter pending donations and sort by proximity
        const pending = res.data.filter(d => d.status === 'pending');
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
    const toRad = deg => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km
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
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMsg('Donation claimed successfully!');
      setDonations(prev => prev.filter(d => d._id !== donationId));
    } catch (err) {
      console.error('Error claiming donation:', err);
      setMsg('Error claiming donation.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Nearby Donation Requests</h2>

      {msg && <p className="mb-2 text-sm text-green-600">{msg}</p>}

      {donations.length === 0 ? (
        <p>No pending donations nearby.</p>
      ) : (
        donations.map((donation) => (
          <div key={donation._id} className="border p-4 mb-4 rounded shadow">
            <p><strong>Food:</strong> {donation.foodName}</p>
            <p><strong>Quantity:</strong> {donation.quantity}</p>
            <p><strong>Cooking Time:</strong> {donation.cookingTime} mins</p>
            <p><strong>Predicted Expiry:</strong> {donation.predictedExpiry || 'Unknown'}</p>
            <p><strong>Location:</strong> {donation.location.lat}, {donation.location.lng}</p>
            <button
              onClick={() => handleClaim(donation._id)}
              className="mt-2 bg-green-600 text-white py-1 px-4 rounded"
            >
              Accept Request
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NearbyRequests;
