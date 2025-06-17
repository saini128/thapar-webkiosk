'use client';

import { DashboardProvider } from '@/context/dashboardContext'; // adjust path if needed

export default function MainLayout({ children }) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
}
