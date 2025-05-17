import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const donationRes = await axios.get(`${import.meta.env.VITE_API_URL}/donations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(userRes.data);
      setDonations(donationRes.data);
    };

    fetchAll();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <h3 className="text-lg font-semibold mb-2">Users</h3>
      <ul className="mb-6">
        {users.map((u) => (
          <li key={u._id}>{u.name} - {u.role}</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-2">Donations</h3>
      <ul>
        {donations.map((d) => (
          <li key={d._id}>
            {d.foodName} by {d.donor.name} → {d.receiver?.name || 'Unclaimed'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
