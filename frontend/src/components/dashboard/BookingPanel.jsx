'use client';

import { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import {
  CalendarDays, Activity,
} from 'lucide-react';

export default function BookingPanel() {
  const {
    user, token, API_BASE_URL,
    patients,
    doctorsList,
    appointmentsList,
    walkinPatientId, setWalkinPatientId,
    walkinDoctorId, setWalkinDoctorId,
    handleQueueCheckin,
    fetchDoctorWorklist,
    fetchAppointments,
  } = useDashboard();

  const [bookingPatientId, setBookingPatientId] = useState('');
  const [bookingDoctorId, setBookingDoctorId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [recentBooking, setRecentBooking] = useState(null);
  const recentPatient = recentBooking ? patients.find((p) => p.id === recentBooking.patientId) : null;
  const recentDoctor = recentBooking ? doctorsList.find((d) => d.id === recentBooking.doctorId) : null;

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    setRecentBooking(null);

    if (!bookingPatientId || !bookingDoctorId || !bookingDate) {
      setBookingMessage('Error: All booking fields are required.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: bookingPatientId,
          doctorId: bookingDoctorId,
          appointmentDate: bookingDate,
          reason: bookingReason
        })
      });

      const data = await res.json();
      if (res.ok) {
        setBookingMessage('Success: Appointment booked successfully!');
        setBookingReason('');
        setRecentBooking(data.appointment || null);
        fetchAppointments();
        if (user.role === 'DOCTOR') fetchDoctorWorklist();
      } else {
        setBookingMessage(`Error: ${data.error || 'Failed to book'}`);
      }
    } catch (err) {
      setBookingMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass p-6 rounded-2xl shadow-md border border-slate-200">
          <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-teal-600" />
            Schedule Appointment Slot
          </h3>

          {bookingMessage && (
            <div className={`p-3 text-sm rounded-lg mb-4 ${bookingMessage.startsWith('Success') ? 'bg-teal-500/15 text-teal-600 border border-teal-500/20' : 'bg-rose-500/15 text-rose-500 border border-rose-500/20'}`}>
              {bookingMessage}
            </div>
          )}

          {recentBooking && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 mb-4 text-xs text-slate-700 space-y-1">
              <p className="font-extrabold uppercase tracking-wider text-slate-700">Recently Booked</p>
              <p><span className="font-bold">Appointment ID:</span> {recentBooking.id}</p>
              <p><span className="font-bold">Patient:</span> {recentPatient?.name || recentBooking.patientId}</p>
              <p><span className="font-bold">Doctor:</span> {recentDoctor?.name || recentBooking.doctorId}</p>
              <p><span className="font-bold">Date:</span> {new Date(recentBooking.appointmentDate).toLocaleString()}</p>
              <p><span className="font-bold">Status:</span> {recentBooking.status}</p>
            </div>
          )}

          <form onSubmit={handleBookAppointment} className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1">Select Registered Patient*</label>
              <select
                required
                value={bookingPatientId}
                onChange={(e) => setBookingPatientId(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 bg-white/50 rounded-lg text-slate-900 text-sm focus:outline-none"
              >
                <option value="">-- Choose Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.phoneNumber})</option>
                ))}
              </select>
              <span className="text-xxs text-slate-600 block mt-1">If client is missing, register them in the Directory tab first.</span>
            </div>

            <div>
              <label className="block mb-1">Select Physician*</label>
              <select
                required
                value={bookingDoctorId}
                onChange={(e) => setBookingDoctorId(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 bg-white/50 rounded-lg text-slate-900 text-sm focus:outline-none"
              >
                <option value="">-- Choose Physician --</option>
                {doctorsList.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} - {d.specialization} (${d.consultationFee})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Appointment Date & Time*</label>
              <input
                type="datetime-local"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 bg-white/50 rounded-lg text-slate-900 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Consultation Objective / Reason</label>
              <input
                type="text"
                value={bookingReason}
                onChange={(e) => setBookingReason(e.target.value)}
                placeholder="Regular diagnostic review, suture removal..."
                className="block w-full px-3 py-2 border border-slate-300 bg-white/50 rounded-lg text-slate-900 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="glow-btn w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-lg shadow-md transition-colors duration-300 mt-2"
            >
              Book Appointment Slot
            </button>
          </form>
        </div>

        <div className="glass p-6 rounded-2xl shadow-md border border-slate-200">
          <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-teal-600" />
            Active Direct Queue Check-In
          </h3>
          <p className="text-xs text-slate-700 mb-6 font-semibold">
            Generate an immediate waiting token for a direct walk-in patient. Allocates active positions under selected practitioners.
          </p>

          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-teal-500/25 bg-teal-500/10 text-slate-700 text-xs leading-5">
              <strong>Token Generation Engine Note:</strong> Direct arrivals bypass appointments. The token engine automatically fetches the current days maximum token size and increments.
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Select Walk-in Patient*</label>
                <select
                  value={walkinPatientId}
                  onChange={(e) => setWalkinPatientId(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 bg-white/50 rounded-lg text-slate-900 text-sm focus:outline-none"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Assign Physician*</label>
                <select
                  value={walkinDoctorId}
                  onChange={(e) => setWalkinDoctorId(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 bg-white/50 rounded-lg text-slate-900 text-sm focus:outline-none"
                >
                  <option value="">-- Choose Physician --</option>
                  {doctorsList.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  if (!walkinPatientId || !walkinDoctorId) {
                    alert('Select patient and doctor first');
                    return;
                  }
                  handleQueueCheckin(walkinPatientId, walkinDoctorId);
                }}
                className="glow-btn w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-lg shadow-md transition-colors duration-300 mt-2"
              >
                Generate Live Token
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl shadow-md border border-slate-200">
        <h3 className="text-lg font-extrabold text-slate-800 mb-4">
          Recent Bookings
        </h3>
        {appointmentsList.length === 0 ? (
          <p className="text-sm text-slate-600">No appointments loaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
              <thead>
                <tr className="text-slate-600 uppercase tracking-widest text-xxs font-bold border-b border-slate-200">
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Doctor</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointmentsList.slice(0, 8).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-500/5 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-slate-800">
                      {new Date(app.appointmentDate).toLocaleString()}
                    </td>
                    <td className="py-3.5 text-slate-700 font-semibold">
                      {app.patient?.name || 'Unknown Patient'}
                    </td>
                    <td className="py-3.5 text-slate-700 font-semibold">
                      {app.doctor?.name || 'Unknown Doctor'}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xxs font-extrabold tracking-wide uppercase ${app.status === 'COMPLETED' ? 'bg-teal-500/10 text-teal-600' : app.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
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
  );
}
