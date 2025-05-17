import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 text-white px-6 py-3 flex justify-between items-center">
    <Link to="/"> <h1 className="text-xl font-bold">NutriSave</h1></Link> 
      <div className="flex items-center space-x-4">
        {user && (
          <>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <span>Hi, {user.name}</span>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            {user.role === 'donor' && <Link to="/donate">Donate</Link>}

            <button onClick={handleLogout} className="bg-white text-green-600 px-3 py-1 rounded">
              Logout
            </button>
          </>
        )}
        {!user && (
          <>
          
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
