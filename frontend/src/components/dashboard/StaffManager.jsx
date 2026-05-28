'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, Users, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function StaffManager() {
  const { token, API_BASE_URL } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('RECEPTIONIST');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(
() => {
    if (!token) return;

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!cancelled) {
          if (data.success) setUsers(data.users);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [token, API_BASE_URL]);

  const refreshUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (data.success) {
        setMessageType('success');
        setMessage(`${name} registered as ${role}`);
        setName('');
        setEmail('');
        setPassword('');
        setRole('RECEPTIONIST');
        refreshUsers();
      } else {
        setMessageType('error');
        setMessage(data.error || 'Registration failed');
      }
    } catch (err) {
      setMessageType('error');
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const roleIcon = (r) => <Shield className={`h-3 w-3 ${r === 'DOCTOR' ? 'text-teal-600' : 'text-amber-600'}`} />;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass p-6 rounded-2xl border border-slate-200 shadow-md h-fit">
        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-6">
          <UserPlus className="h-5 w-5 text-teal-600" />
          Create Staff Account
        </h3>

        {message && (
          <div className={`p-3 text-sm rounded-lg mb-4 ${
            messageType === 'success'
              ? 'bg-teal-500/15 text-teal-600 border border-teal-500/20'
              : 'bg-rose-500/15 text-rose-500 border border-rose-500/20'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block mb-1">Full Name*</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Jane Smith"
              className="block w-full px-3 py-2 border border-slate-300 bg-white/50 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block mb-1">Email Address*</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.smith@haqms.com"
              className="block w-full px-3 py-2 border border-slate-300 bg-white/50 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block mb-1">Password*</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, upper+lower+number+special"
                className="block w-full px-3 py-2 pr-10 border border-slate-300 bg-white/50 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">Role*</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 bg-white/50 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="glow-btn w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-lg shadow-md transition-colors duration-300 mt-2 disabled:opacity-50"
          >
            {submitting ? 'Creating Account...' : 'Register Staff'}
          </button>
        </form>
      </div>

      <div className="glass p-6 rounded-2xl border border-slate-200 shadow-md h-fit">
        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-teal-600" />
          All Staff Accounts
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 text-teal-600 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center py-8 text-slate-600 text-sm">
            No staff accounts found.
          </p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {users.map((u) => (
              <div key={u.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600">
                  {roleIcon(u.role)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                  <p className="text-xxs text-slate-600 truncate">{u.email}</p>
                </div>
                <span className={`text-xs font-extrabold tracking-wide uppercase px-2 py-0.5 rounded ${
                  u.role === 'DOCTOR'
                    ? 'bg-teal-500/10 text-teal-600'
                    : 'bg-amber-500/10 text-amber-600'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
