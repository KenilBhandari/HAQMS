'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';

import { useDashboard } from '@/context/DashboardContext';
import PatientRegistry from '@/components/dashboard/PatientRegistry';
import BookingPanel from '@/components/dashboard/BookingPanel';
import DoctorAppointments from '@/components/dashboard/DoctorAppointments';
import DoctorQueue from '@/components/dashboard/DoctorQueue';
import AdminReports from '@/components/dashboard/AdminReports';
import PhysicianRegistry from '@/components/dashboard/PhysicianRegistry';
import StaffManager from '@/components/dashboard/StaffManager';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { checkinMessage, setCheckinMessage } = useDashboard();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (!user) return;
    Promise.resolve().then(() => {
      setActiveTab(
        user.role === 'ADMIN'
          ? 'reports'
          : user.role === 'RECEPTIONIST'
            ? 'patients'
            : 'appointments'
      );
    });
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  const tabClass = (tab) =>
    `py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
      activeTab === tab
        ? 'border-teal-500 text-teal-600'
        : 'border-transparent text-slate-700'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-4">
          {user.role === 'ADMIN' && (
            <>
              <button onClick={() => setActiveTab('reports')} className={tabClass('reports')}>
                System Audit Reports
              </button>
              <button onClick={() => setActiveTab('physicians')} className={tabClass('physicians')}>
                Physician Registry
              </button>
              <button onClick={() => setActiveTab('staff')} className={tabClass('staff')}>
                Staff Management
              </button>
            </>
          )}

          {(user.role === 'RECEPTIONIST' || user.role === 'ADMIN') && (
            <>
              <button onClick={() => setActiveTab('patients')} className={tabClass('patients')}>
                Patient Registry Directory
              </button>
              <button onClick={() => setActiveTab('book')} className={tabClass('book')}>
                Scheduling / Check-in Portal
              </button>
            </>
          )}

          {user.role === 'DOCTOR' && (
            <>
              <button onClick={() => setActiveTab('appointments')} className={tabClass('appointments')}>
                My Scheduled Bookings
              </button>
              <button onClick={() => setActiveTab('queue')} className={tabClass('queue')}>
                Active Calling Queue
              </button>
            </>
          )}
        </div>

        {checkinMessage && (
          <div className="p-4 mb-6 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-between text-sm">
            <span>{checkinMessage}</span>
            <button onClick={() => setCheckinMessage('')} className="font-bold underline text-xs">Dismiss</button>
          </div>
        )}

        <div className={activeTab === 'patients' ? '' : 'hidden'}><PatientRegistry /></div>
        <div className={activeTab === 'book' ? '' : 'hidden'}><BookingPanel /></div>
        <div className={activeTab === 'appointments' ? '' : 'hidden'}><DoctorAppointments /></div>
        <div className={activeTab === 'queue' ? '' : 'hidden'}><DoctorQueue /></div>
        <div className={activeTab === 'reports' ? '' : 'hidden'}><AdminReports /></div>
        <div className={activeTab === 'physicians' ? '' : 'hidden'}><PhysicianRegistry /></div>
        <div className={activeTab === 'staff' ? '' : 'hidden'}><StaffManager /></div>
      </main>
    </div>
  );
}
