'use client';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
