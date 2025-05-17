import React from 'react';
import DonationForm from '../components/DonationForm';
import MapView from '../components/MapView';
import { useAuth } from '../context/AuthContext';
import Metrics from '../components/Metrics';
function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <Metrics/>
    </div>
  );
}

export default Dashboard;
