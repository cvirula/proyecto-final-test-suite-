export function StatCard({ label, value, icon: Icon, tone = 'ink' }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-icon"><Icon size={20} strokeWidth={1.8} /></div>
      <div><strong>{value ?? '—'}</strong><span>{label}</span></div>
    </article>
  );
}
