'use client';

import { useState } from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import DebugPanel from '@/components/DebugPanel';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  
  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'proservice';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setShowError(false);
    } else {
      setShowError(true);
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-lg shadow-md border">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Enter your password to access the admin panel
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setShowError(false);
                  }}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  required
                />
                {showError && (
                  <p className="mt-2 text-sm text-red-600">
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Access Dashboard
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500 text-center">
                Default password: proservice
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Change this in your environment variables
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminDashboard />
      <DebugPanel />
    </>
  );
}