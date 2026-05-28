'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Activity, LogOut, LayoutDashboard, MonitorPlay, Shield, AlertTriangle, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return null;

  const linkClass = (href) =>
    `flex items-center gap-1.5 text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg ${
      pathname === href
        ? 'bg-teal-500/10 text-teal-700 shadow-sm'
        : 'text-slate-700 hover:text-teal-600 hover:bg-slate-500/5'
    }`;

  return (
    <>
      <nav className="glass sticky top-0 z-50 border-b border-slate-200 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-teal-600 font-extrabold text-2xl tracking-tight">
            <Activity className="h-6 w-6 animate-pulse" />
            <span>HAQMS</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className={linkClass('/dashboard')}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/queue" className={linkClass('/queue')}>
              <MonitorPlay className="h-4 w-4" />
              Live Queue
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">{user.name}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xxs font-extrabold tracking-wide uppercase bg-teal-500/10 text-teal-600 border border-teal-500/20">
                <Shield className="h-3 w-3" />
                {user.role}
              </span>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all duration-300 focus:outline-none"
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="glass p-6 rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full mx-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-800">Confirm Logout</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Are you sure you want to sign out? You will need to log in again to access the dashboard.
                </p>
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
