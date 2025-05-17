// AddDonationRequest.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddDonationRequest = () => {
  const [form, setForm] = useState({
    foodName: '',
    quantity: '',
    lat: '',
    lng: '',
    storageTemp: '',
    humidity: '',
    cookingTime: ''
  });

  const [expiry, setExpiry] = useState('');
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    try {
      const res = await axios.post('http://localhost:5002/predict', {
        foodType: form.foodName,
        cookingTime: form.cookingTime,
        storageTemp: form.storageTemp,
        humidity: form.humidity
      });
      setExpiry(res.data.expiry);
    } catch (err) {
      console.error('Prediction failed:', err);
      setExpiry('Unknown');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const res = await axios.post('http://localhost:5001/api/donations', {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMsg('Donation submitted successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMsg('Error submitting donation.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Donation Request</h2>

      {['foodName', 'quantity', 'lat', 'lng', 'storageTemp', 'humidity', 'cookingTime'].map((field) => (
        <input
          key={field}
          name={field}
          type={field === 'quantity' || field === 'lat' || field === 'lng' || field === 'storageTemp' || field === 'humidity' || field === 'cookingTime' ? 'number' : 'text'}
          placeholder={field.replace(/([A-Z])/g, ' $1')}
          value={form[field]}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
      ))}

      <button type="button" onClick={handlePredict} className="bg-blue-500 text-white py-2 px-4 rounded mb-2 w-full">
        Predict Expiry
      </button>

      {expiry && (
        <p className="text-sm text-gray-700 mb-2">Predicted Expiry: <strong>{expiry}</strong></p>
      )}

      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded w-full">
        Submit Donation
      </button>

      {msg && <p className="mt-3 text-sm text-gray-600">{msg}</p>}
    </form>
  );
};

export default AddDonationRequest;
