"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (token: string) => void;
}

export default function AuthModal({ mode, onClose, onAuthSuccess }: AuthModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMounted) return;
    
    setIsLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? 'token' : 'register';
      const payload = mode === 'login' ? {
        username: formData.username,
        password: formData.password
      } : {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        full_name: formData.fullName
      };

      const response = await axios.post(
        `http://localhost:8000/${endpoint}`,
        mode === 'login' ? new URLSearchParams(payload) : payload,
        {
          headers: {
            'Content-Type': mode === 'login' 
              ? 'application/x-www-form-urlencoded' 
              : 'application/json'
          }
        }
      );

      if (mode === 'login') {
        if (response.data.access_token) {
          onAuthSuccess(response.data.access_token);
        } else {
          throw new Error('Authentication failed: No token received');
        }
      } else {
        const loginResponse = await axios.post(
          'http://localhost:8000/token',
          new URLSearchParams({
            username: formData.username,
            password: formData.password
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );
        onAuthSuccess(loginResponse.data.access_token);
      }
    } catch (err) {
      let errorMessage = 'Authentication failed';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.detail || 
                      err.response?.data?.message || 
                      err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-700">
            {mode === 'login' ? 'Login' : 'Register'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-800 bg-white"
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-800 bg-white"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-800 bg-white"
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-800 bg-white"
              placeholder="Enter your password"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-md text-white font-medium ${
              isLoading ? 'bg-purple-500' : 'bg-purple-700 hover:bg-purple-800'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              mode === 'login' ? 'Login' : 'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}