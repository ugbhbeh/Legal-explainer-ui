import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

import AuthContext from '../services/AuthContext.js';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.username || !formData.password) {
      setError('All fields are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await api.post('/users', formData);
      if (response.status === 201 && response.data.token && response.data.userId) {
        login(response.data.userId, response.data.token);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError('Email or username already exists.');
      } else {
        setError(error.response?.data?.error || 'Signup failed, please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleGuestLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await api.post('/users/guest');
      if (res.status !== 200) {
        throw new Error('Guest login failed');
      }
      const data = res.data;
      if (data.token && data.userId) {
        login(data.userId, data.token);
        navigate('/');
      } else {
        setError('Guest login failed. Please try again.');
      }
    } catch (err) {
      console.error('Guest login error:', err);
      setError('Guest login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-gray-50 rounded-2xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        {error && (
          <div className="p-2 text-sm text-red-600 bg-red-100 rounded">Enter valid Email and Password</div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <p className="text-gray-600">Or continue as guest:</p>
        <button
          onClick={handleGuestLogin}
          disabled={isSubmitting}
          className="mt-2 w-full py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in as Guest...' : 'Continue as Guest'}
        </button>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;