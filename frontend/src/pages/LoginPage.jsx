// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock auth - set flag and redirect
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl border border-green-500/30 shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-green-500 text-gray-900 font-bold text-xs px-2 py-1 rounded mb-2">
            CERBERUS ADMIN
          </div>
          <h1 className="text-2xl font-bold text-green-400">Welcome, Admin.</h1>
          <p className="text-gray-400 mt-1">Enter credentials to access the defense suite</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-100 placeholder-gray-500"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-100 placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-gray-900 transition duration-200 transform hover:scale-[1.02]"
          >
            SECURE LOGIN
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Defense Suite v1.0 • Unauthorized access prohibited
        </div>
      </div>
    </div>
  );
};

export default LoginPage;