'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import {
  User, FileText, CalendarDays, ChevronLeft, AlertCircle,
  Loader2, ShieldAlert, Phone, Mail
} from 'lucide-react';

export default function PatientHistoryRecords() {
  const { id } = useParams();
  const { user, token, API_BASE_URL } = useAuth();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchPatient = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setPatient(data.patient);
        } else {
          setError(data.error || 'Failed to load patient records');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, token, API_BASE_URL]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-sm text-slate-400">Please log in to view patient records.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8">
        {/* Back Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-400">Loading patient medical records...</p>
          </div>
        ) : error ? (
          <div className="glass p-8 rounded-2xl border border-rose-500/20 shadow-md text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Error Loading Records</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
          </div>
        ) : !patient ? (
          <div className="glass p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md text-center">
            <ShieldAlert className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Patient Not Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No patient record found with the specified ID.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Patient Info Header */}
            <div className="glass p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                    {patient.name}
                  </h1>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Patient Medical Record
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold">
                    Age / Gender
                  </span>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {patient.age} yrs / <span className="capitalize">{patient.gender}</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Contact
                  </span>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {patient.phoneNumber}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </span>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {patient.email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="glass p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-teal-600" />
                Clinical Background Information
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <p className="text-slate-700 dark:text-slate-300 leading-6 text-sm font-semibold">
                  {patient.medicalHistory?.toUpperCase() ?? 'No clinical history recorded'}
                </p>
              </div>
            </div>

            {/* Appointment History */}
            <div className="glass p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                <CalendarDays className="h-5 w-5 text-teal-600" />
                Appointment History
              </h3>

              {!patient.appointments?.length ? (
                <p className="text-center py-6 text-slate-400 text-sm">
                  No appointments found for this patient.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm text-left">
                    <thead>
                      <tr className="text-slate-400 uppercase tracking-widest text-xxs font-bold border-b border-slate-200 dark:border-slate-800">
                        <th className="pb-3">Date &amp; Time</th>
                        <th className="pb-3">Reason</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {patient.appointments.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-500/5 transition-colors">
                          <td className="py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                            {new Date(app.appointmentDate).toLocaleDateString([], {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3.5 text-slate-500 dark:text-slate-400 font-semibold">
                            {app.reason || 'None provided'}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xxs font-extrabold tracking-wide uppercase ${
                                app.status === 'COMPLETED'
                                  ? 'bg-teal-500/10 text-teal-600'
                                  : app.status === 'CANCELLED'
                                    ? 'bg-rose-500/10 text-rose-500'
                                    : 'bg-amber-500/10 text-amber-500'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
