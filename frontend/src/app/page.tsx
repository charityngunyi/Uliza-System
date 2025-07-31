"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import QuestionForm from '@/components/QuestionForm';
import AnswerDisplay from '@/components/AnswerDisplay';
import QueryHistory from '@/components/QueryHistory';
import ClientOnly from '@/components/ClientOnly';

// Dynamically import AuthModal with no SSR
const AuthModal = dynamic(() => import('@/components/AuthModal'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"></div>
});

type HistoryItem = {
  question: string;
  answer: string;
};

export default function Home() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isQueryLoading, setIsQueryLoading] = useState(false); // Renamed from isLoading
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state after mount
 // Modify your useEffect for checking auth state
useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post(
          'http://localhost:8000/token/verify',
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setUser({ username: response.data.username }); // Update with actual username from backend
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  };

  checkAuth();
}, []);

  const handleAnswer = (question: string, answer: string) => {
    setAnswer(answer);
    setError('');
    setHistory(prev => [...prev, { question, answer }]);
  };

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('token', token);
    setUser({ username: 'demo-user' });
    setAuthModal(null);
    router.replace('/'); // Clear any auth params
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.refresh();
  };

  return (
    <ClientOnly>
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-600">
              <span className="text-emerald-500">ULIZA</span> Q&A System
            </h1>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-purple-700">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => setAuthModal('login')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthModal('register')}
                  className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Left Column - History */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <QueryHistory history={history} onSelect={(q) => {
              const selected = history.find(item => item.question === q);
              if (selected) setAnswer(selected.answer);
            }} />
          </div>

          {/* Center Column - Question Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            {!user ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Please login to ask questions
                </h2>
                <div className="flex flex-col space-y-3 max-w-xs mx-auto">
                  <button
                    onClick={() => setAuthModal('login')}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthModal('register')}
                    className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            ) : (
              <QuestionForm 
                onAnswer={handleAnswer} 
                onError={setError}
                setIsLoading={setIsQueryLoading}
              />
            )}
          </div>

          {/* Right Column - Answer Display */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <AnswerDisplay answer={answer} isLoading={isQueryLoading} />
          </div>
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {authModal && (
          <AuthModal 
            mode={authModal} 
            onClose={() => setAuthModal(null)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </main>
    </ClientOnly>
  );
}