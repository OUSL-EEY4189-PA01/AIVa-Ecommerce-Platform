import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black tracking-tighter text-center mb-8">Create Account</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-black/50 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-black/50 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-black/50 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-black/50 mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white font-medium hover:bg-black/80 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-black/50">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
