"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function QuestionForm({ onAnswer, onError, setIsLoading }) {
  const [question, setQuestion] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMounted) return;
    
    if (!question.trim()) {
      onError('Please enter a question');
      return;
    }

    setLocalLoading(true);
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to ask questions');

      const response = await axios.post(
        'http://localhost:8000/ask', 
        { question: question },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (isMounted) {
        onAnswer(question, response.data.answer);
        setQuestion('');
      }
    } catch (error) {
      if (isMounted) {
        if (error.response?.status === 401) {
          onError('Session expired. Please login again.');
          localStorage.removeItem('token');
          window.location.reload();
        } else {
          onError(error.response?.data?.detail || error.message || 'Failed to get answer');
        }
      }
    } finally {
      if (isMounted) {
        setLocalLoading(false);
        setIsLoading(false);
      }
    }
  };

  if (!isMounted) return (
    <form className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-800 mb-1">
          Your Question
        </label>
        <textarea
          id="question"
          className="w-full p-3 border border-gray-300 rounded-md text-gray-800 bg-white"
          rows={4}
          placeholder="Ask me anything..."
          disabled
        />
      </div>
      <button
        type="button"
        className="w-full py-3 px-6 rounded-md text-white font-medium bg-purple-500"
        disabled
      >
        Loading...
      </button>
    </form>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-800 mb-1">
          Your Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-800 bg-white"
          rows={4}
          placeholder="Ask me anything..."
          disabled={localLoading}
        />
      </div>
      <button
        type="submit"
        disabled={localLoading}
        className={`w-full py-3 px-6 rounded-md text-white font-medium transition-colors ${
          localLoading ? 'bg-purple-500' : 'bg-purple-700 hover:bg-purple-800'
        }`}
      >
        {localLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Ask Question'
        )}
      </button>
    </form>
  );
}