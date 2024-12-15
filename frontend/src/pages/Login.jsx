import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GAuth from '../components/GAuth';

export default function Login() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        setError(data.message);
      } else {
        setError(null);
        if (response.ok) {
          navigate('/home');
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-slate-200">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-11/12 md:w-1/2 lg:w-1/3 h-[500px] mt-20">
        <h2 className="text-3xl font-bold mb-7 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="name@company.com"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-transform duration-300 hover:scale-105"
              required
            />
          </div>
          <div className="mb-8">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-transform duration-300 hover:scale-105"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform duration-300 hover:scale-105"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>
          <div className="flex items-center justify-center my-3">
            <hr className="w-1/3 border-t border-gray-300" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="w-1/3 border-t border-gray-300" />
          </div>
          <GAuth />
          {error && (
            <p className="text-red-500 text-sm text-center mt-4 bg-red-100 py-1 rounded-md">{error}</p>
          )}
        </form>
        <p className="mt-3 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-indigo-500 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}