'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [showMarks, setShowMarks] = useState(false);
  const [showGrades, setShowGrades] = useState(false);

  const fetchDashboard = async () => {
    const res = await fetch('/api/dashboard', { credentials: 'include' });
    if (res.status === 401) {
      router.push('/login');
    } else {
      const json = await res.json();
      setDashboardData(json.data);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('dashboardData');
    await fetch('/api/signout');
    router.push('/login');
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!dashboardData) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  const personal = dashboardData.results['https://webkiosk.thapar.edu/StudentFiles/PersonalFiles/StudPersonalInfo.jsp']?.parsed?.data;
  const marks = dashboardData.results['https://webkiosk.thapar.edu/StudentFiles/Exam/StudentEventMarksView.jsp?x=&exam=ALL']?.parsed?.data || [];
  const grades = dashboardData.results['https://webkiosk.thapar.edu/StudentFiles/Exam/StudentEventGradesView.jsp']?.parsed?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 p-6">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 relative">
        <img
          src="/about2.png"
          alt="Thapar"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none rounded-xl"
        />

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-green-800 mb-3">Welcome, {personal.name}</h1>
          <p className="text-md text-gray-700 mb-2">{personal.course} - Semester {personal.semester}</p>
          <p className="text-sm text-gray-600 mb-4">Email: {personal.contact.student.email[1]}</p>

          <div className="flex space-x-4 mb-6">
            <button onClick={() => setShowMarks(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">View Marks</button>
            <button onClick={() => setShowGrades(true)} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">View Grades</button>
            <button onClick={handleLogout} className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
          </div>

          {/* 📊 Chart Example */}
          <div className="bg-white shadow p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Recent Scores Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marks.slice(0, 10)}>
                <XAxis dataKey="subject" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="effectiveMarks" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 📋 Marks Modal */}
          {showMarks && (
            <div className="fixed inset-0 bg-black/60 z-20 flex items-center justify-center">
              <div className="bg-white w-full max-w-4xl p-6 rounded-xl shadow-lg overflow-y-scroll max-h-[90vh]">
                <h2 className="text-xl font-bold mb-4">Exam Marks</h2>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-700">
                      <th>Subject</th>
                      <th>Event</th>
                      <th>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((m, i) => (
                      <tr key={i} className="border-b last:border-none">
                        <td>{m.subject}</td>
                        <td>{m.event}</td>
                        <td>{m.obtainedMarks} / {m.fullMarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => setShowMarks(false)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800">Close</button>
              </div>
            </div>
          )}

          {/* 🏅 Grades Modal */}
          {showGrades && (
            <div className="fixed inset-0 bg-black/60 z-20 flex items-center justify-center">
              <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg overflow-y-scroll max-h-[90vh]">
                <h2 className="text-xl font-bold mb-4">Grades</h2>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-700">
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g, i) => (
                      <tr key={i} className="border-b last:border-none">
                        <td>{g.subject}</td>
                        <td>{g.marksObtained} / {g.maxMarks}</td>
                        <td className="font-semibold">{g.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => setShowGrades(false)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
