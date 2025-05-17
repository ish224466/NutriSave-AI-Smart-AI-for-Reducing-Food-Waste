import React, { useState } from 'react';
import axios from 'axios';

function DonationForm() {
  const [form, setForm] = useState({
    foodName: '',
    quantity: '',
    lat: '',
    lng: '',
    humidity: '',
    storageTemp: '',
    cookingTime: '',
    predictedExpiry: '',
    // image: null,
  });

  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // const handleImage = (e) => {
  //   setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      foodType: form.foodName,
      cookingTime: form.cookingTime,
      storageTemp: form.storageTemp,
      humidity: form.humidity,
    };
  
    try {
      const res = await axios.post('http://localhost:5002/predict', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      setMsg('Prediction: ' + res.data.expiry);
    } catch (err) {
      console.error(err);
      setMsg('Error submitting donation');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Donate Food</h3>
      <input
        name="foodName"
        placeholder="Food Name"
        className="w-full p-2 border rounded mb-2"
        onChange={handleChange}
      />
      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        className="w-full p-2 border rounded mb-2"
        onChange={handleChange}
      />
      <input
        name="lat"
        placeholder="Latitude"
        className="w-full p-2 border rounded mb-2"
        onChange={handleChange}
      />
      <input
        name="lng"
        placeholder="Longitude"
        className="w-full p-2 border rounded mb-2"
        onChange={handleChange}
      />
      <input
        name="storageTemp"
        type="number"
        placeholder="Storage Temperature (in °C)"
        className="w-full p-2 border rounded mb-2"
        onChange={handleChange}
      />
      <input
        name="humidity"
        type="number"
        placeholder="Humidity"
        className="w-full p-2 border rounded mb-2"
        onChange={handleChange}
      />
      <input
        name="cookingTime"
        type="number"
        placeholder="Cooking Time (in minutes)"
        className="w-full p-2 border rounded mb-2"
        onChange={handleChange}
      />

      {/* <input
        name="image"
        type="file"
        className="w-full mb-2"
        accept="image/*"
        onChange={handleImage}
      /> */}
      <button className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      {msg && <h2 className="mt-2 text-sm text-gray-600">{msg}</h2>}
    </form>
  );
}

export default DonationForm;
