import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/users/login', { email, password });
      const { token } = response.data;

      // Store the token in localStorage
      localStorage.setItem('authToken', token);

      // Redirect to Dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
