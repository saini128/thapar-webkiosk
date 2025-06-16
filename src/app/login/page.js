'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [memberCode, setMemberCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ memberCode, password }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        setError('Incorrect member code or password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Login to WebKiosk</h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-black">
          <div>
            <label htmlFor="memberCode" className="block mb-1 text-sm font-semibold text-gray-800">
              Member Code
            </label>
            <input
              id="memberCode"
              type="text"
              value={memberCode}
              onChange={(e) => setMemberCode(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
              placeholder="Enter your enrollment number"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
