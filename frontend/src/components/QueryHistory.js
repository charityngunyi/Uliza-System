"use client";
import { useState } from 'react';

export default function QueryHistory({ history, onSelect }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-purple-800">History</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {isOpen && (
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              No queries yet
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => onSelect(item.question)}
                    className="w-full text-left p-3 hover:bg-purple-50 rounded-md transition-colors group"
                  >
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-600">
                      {item.question}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {new Date().toLocaleString()}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}