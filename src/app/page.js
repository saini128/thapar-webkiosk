'use client';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/signout', { method: 'GET' });
    router.push('/login');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white shadow-lg p-10 rounded-xl text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome! You are authenticated.</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
