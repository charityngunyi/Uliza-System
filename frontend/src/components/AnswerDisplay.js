"use client";
import { useEffect } from 'react';

export default function AnswerDisplay({ answer, isLoading }) {
  useEffect(() => {
    const element = document.getElementById('answer-container');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [answer]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold text-purple-800 mb-4">Answer</h2>
      <div
        id="answer-container"
        className={`flex-1 p-4 border rounded-lg overflow-y-auto ${
          isLoading ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : answer ? (
          <div className="prose" dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, '<br />') }} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <p>Submit a question to see answers here</p>
          </div>
        )}
      </div>
    </div>
  );
}