'use client';

const STATUS_STYLES = {
  COMPLETED: 'bg-teal-500/10 text-teal-600',
  CANCELLED: 'bg-rose-500/10 text-rose-500',
  PENDING: 'bg-amber-500/10 text-amber-500',
  CALLING: 'bg-teal-500 text-white',
  WAITING: 'bg-amber-500/10 text-amber-500',
  SKIPPED: 'bg-rose-500/10 text-rose-500',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xxs font-extrabold tracking-wide uppercase ${STATUS_STYLES[status] || 'bg-slate-500/10 text-slate-500'}`}>
      {status}
    </span>
  );
}
