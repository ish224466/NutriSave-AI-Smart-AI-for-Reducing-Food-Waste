import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor' });
  const [errMsg, setErrMsg] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/auth/register`, form);
      navigate('/login');
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {errMsg && <p className="text-red-500">{errMsg}</p>}
        <input
          name="name"
          placeholder="Name"
          className="w-full p-2 border rounded my-2"
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded my-2"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded my-2"
          onChange={handleChange}
        />
        <select
          name="role"
          className="w-full p-2 border rounded my-2"
          onChange={handleChange}
        >
          <option value="donor">Donor</option>
          <option value="receiver">Receiver</option>
        </select>
        <button className="w-full bg-green-600 text-white py-2 rounded mt-2">Register</button>
      </form>
    </div>
  );
}

export default Register;
