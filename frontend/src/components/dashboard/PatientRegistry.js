'use client';

import { useState, useEffect, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import {
  Search, ClipboardList, UserPlus, Trash2,
} from 'lucide-react';

export default function PatientRegistry() {
  const {
    user, token, API_BASE_URL,
    patients, loading, pagination,
    search, setSearch,
    gender, setGender,
    fetchPatients,
    walkinDoctorId,
    handleQueueCheckin,
  } = useDashboard();

  const debounceRef = useRef(null);

  useEffect(() => {
    if (user && (user.role === 'RECEPTIONIST' || user.role === 'ADMIN')) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchPatients(1), 300);
    }
    return () => clearTimeout(debounceRef.current);
  }, [search, gender]);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regHistory, setRegHistory] = useState('');
  const [regMessage, setRegMessage] = useState('');

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setRegMessage('');

    if (!regName || !regPhone || !regAge) {
      setRegMessage('Error: Name, Age and Phone number are required.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phoneNumber: regPhone,
          age: regAge,
          gender: regGender,
          medicalHistory: regHistory
        })
      });

      const data = await res.json();
      if (res.ok) {
        setRegMessage('Success: Patient registered successfully!');
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegAge('');
        setRegHistory('');
        fetchPatients(1);
      } else {
        setRegMessage(`Error: ${data.error || 'Failed to register'}`);
      }
    } catch (err) {
      setRegMessage(`Error: ${err.message}`);
    }
  };

  const handleDeletePatient = async (id) => {
    if (!confirm('Are you sure you want to delete this patient record?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Patient deleted.');
        fetchPatients(pagination.page);
      } else {
        alert(`Error: ${data.error || 'Unauthorized deletion!'}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-teal-600" />
              Patient Lookup Directory
            </h3>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, phone or email..."
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {loading ? (
              <p className="text-center py-6 text-slate-400 animate-pulse text-sm">Synchronizing table data...</p>
            ) : patients.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-sm">No registered patients match this filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm text-left">
                  <thead>
                    <tr className="text-slate-400 uppercase tracking-widest text-xxs font-bold border-b border-slate-200 dark:border-slate-800">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Age/Sex</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {patients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-500/5 transition-colors">
                        <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                          {p.name}
                          {p.email && <span className="block text-xxs text-slate-400 font-normal mt-0.5">{p.email}</span>}
                        </td>
                        <td className="py-3.5 text-slate-500 dark:text-slate-400 font-medium">{p.phoneNumber}</td>
                        <td className="py-3.5 text-slate-500 dark:text-slate-400">
                          {p.age} yrs / <span className="capitalize">{p.gender}</span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              if (!walkinDoctorId) {
                                alert('Select a doctor in the Direct Queue tab first');
                                return;
                              }
                              handleQueueCheckin(p.id, walkinDoctorId);
                            }}
                            className="text-xxs px-2.5 py-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold hover:bg-teal-500 hover:text-white transition-colors"
                          >
                            Check In
                          </button>

                          <button
                            onClick={() => handleDeletePatient(p.id)}
                            className="text-xxs p-1 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                            title="Delete patient record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchPatients(pagination.page - 1)}
                  className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-teal-500/10 disabled:opacity-50 text-xs font-semibold"
                >
                  Prev
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchPatients(pagination.page + 1)}
                  className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-teal-500/10 disabled:opacity-50 text-xs font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 h-fit">
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <UserPlus className="h-5 w-5 text-teal-600" />
            New Registration
          </h3>

          {regMessage && (
            <div className={`p-3 text-sm rounded-lg mb-4 ${regMessage.startsWith('Success') ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20' : 'bg-rose-500/15 text-rose-500 border border-rose-500/20'}`}>
              {regMessage}
            </div>
          )}

          <form onSubmit={handleRegisterPatient} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div>
              <label className="block mb-1">Patient Full Name*</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Bruce Wayne"
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Age (Years)*</label>
                <input
                  type="number"
                  required
                  value={regAge}
                  onChange={(e) => setRegAge(e.target.value)}
                  placeholder="35"
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Gender*</label>
                <select
                  value={regGender}
                  onChange={(e) => setRegGender(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">Contact Phone*</label>
              <input
                type="text"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="555-0199 (Unchecked format)"
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Email Address</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="bruce@wayne.com"
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Medical Anamnesis / History (Can be left blank)</label>
              <textarea
                value={regHistory}
                onChange={(e) => setRegHistory(e.target.value)}
                placeholder="E.g. cardiovascular risks, asthma..."
                rows="3"
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="glow-btn w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-lg shadow-md transition-colors duration-300 mt-2"
            >
              Register Patient Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
