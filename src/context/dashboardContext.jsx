'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mark, SubjectGrade, CGPAReport } from '@/lib/models/academic';
import { StudentProfile } from '@/lib/models/profile';
import { encrypt, decrypt } from '@/lib/utils/storageCrypto';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export function DashboardProvider({ children }) {
  const [data, setData] = useState(null);
  const router = useRouter();

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard', { credentials: 'include' });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const json = await res.json();
      const encrypted = encrypt(json);
      localStorage.setItem('dashboardData', encrypted);

      const parsed = parseDashboardData(json);
      setData(parsed);
    } catch (e) {
      console.error('Dashboard fetch failed:', e);
    }
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        const storedEncrypted = localStorage.getItem('dashboardData');
        if (storedEncrypted) {
          const decryptedRaw = decrypt(storedEncrypted);
          if (decryptedRaw) {
            const parsed = await parseDashboardData(decryptedRaw);
            setData(parsed);
          }
        } else {
          // If nothing in storage, fetch from server
          await fetchDashboard();
          console.log('Fetched dashboard data from server');
        }

        // Always try background refresh
        fetchDashboard();
      } catch (e) {
        console.warn('Dashboard initialization failed:', e);
      }
    })();
  }, [fetchDashboard]);

  return (
    <DashboardContext.Provider value={{ data }}>
      {children}
    </DashboardContext.Provider>
  );
}
function parseDashboardData(raw) {
  const results = raw.data.results;

  // Personal Info
  const personalRaw = results?.['https://webkiosk.thapar.edu/StudentFiles/PersonalFiles/StudPersonalInfo.jsp']?.parsed?.data || {};
  // personalRaw.enrollmentNo = raw.enrollmentNo;
  const studentProfile = new StudentProfile(personalRaw);

  // Marks
  const marksRaw = results?.['https://webkiosk.thapar.edu/StudentFiles/Exam/StudentEventMarksView.jsp?x=&exam=ALL']?.parsed?.data || [];
  const marks = marksRaw.map(item => new Mark(item));

  // Grades
  const gradesRaw = results?.['https://webkiosk.thapar.edu/StudentFiles/Exam/StudentEventGradesView.jsp']?.parsed?.data || [];
  const subjectGrades = gradesRaw.map(item => new SubjectGrade(item));

  // CGPA Report 
  const cgpaRaw = results?.['https://webkiosk.thapar.edu/StudentFiles/Exam/StudCGPAReport.jsp']?.parsed?.data || [];
  const cgpaReports = cgpaRaw.map(item => new CGPAReport(item));

  const timestamp = raw.timestamp || null;

  console.log('Parsed dashboard data:', {
    studentProfile,
    marks,
    subjectGrades,
    cgpaReports,
    timestamp,
  });
  return {
    studentProfile,
    marks,
    subjectGrades,
    cgpaReports,
    timestamp,
  };
}
