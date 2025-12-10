'use client';


import Dashboard from '@/components/dashboard/Dashboard';
import Navbar from '@/components/layout/Navbar';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Dashboard/>
    </div>
  );
}
