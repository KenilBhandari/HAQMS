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
        <p className="text-sm text-slate-600">Please log in to view patient records.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-600">Loading patient medical records...</p>
          </div>
        ) : error ? (
          <div className="glass p-8 rounded-2xl border border-rose-500/20 shadow-md text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">Error Loading Records</h3>
            <p className="text-sm text-slate-700">{error}</p>
          </div>
        ) : !patient ? (
          <div className="glass p-8 rounded-2xl border border-slate-200 shadow-md text-center">
            <ShieldAlert className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">Patient Not Found</h3>
            <p className="text-sm text-slate-700">
              No patient record found with the specified ID.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Patient Info Header */}
            <div className="glass p-6 rounded-2xl border border-slate-200 shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-500/10 text-teal-600 rounded-xl">
                  <User className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-extrabold text-slate-800 truncate">
                    {patient.name}
                  </h1>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1">
                    Patient Medical Record
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                    Age / Gender
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {patient.age} yrs / <span className="capitalize">{patient.gender}</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-slate-600 font-semibold flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Contact
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {patient.phoneNumber}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-slate-600 font-semibold flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-1 truncate" title={patient.email || 'N/A'}>
                    {patient.email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="glass p-6 rounded-2xl border border-slate-200 shadow-md">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-teal-600" />
                Clinical Background Information
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-slate-700 leading-5 text-sm font-semibold break-words">
                  {patient.medicalHistory?.toUpperCase() ?? 'No clinical history recorded'}
                </p>
              </div>
            </div>

            {/* Appointment History */}
            <div className="glass p-6 rounded-2xl border border-slate-200 shadow-md">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-3">
                <CalendarDays className="h-5 w-5 text-teal-600" />
                Appointment History
              </h3>

              {!patient.appointments?.length ? (
                <p className="text-center py-6 text-slate-600 text-sm">
                  No appointments found for this patient.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
                    <thead>
                      <tr className="text-slate-600 uppercase tracking-widest text-xxs font-bold border-b border-slate-200">
                        <th className="pb-3 pr-3">Date &amp; Time</th>
                        <th className="pb-3 pr-3">Reason</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {patient.appointments.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-500/5 transition-colors">
                          <td className="py-3 pr-3 font-mono font-bold text-slate-800 text-xs whitespace-nowrap">
                            {new Date(app.appointmentDate).toLocaleDateString([], {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 pr-3 text-slate-700 font-semibold break-words min-w-0">
                            {app.reason || 'None provided'}
                          </td>
                          <td className="py-3">
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
