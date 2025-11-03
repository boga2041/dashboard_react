export function StatCard({ title, value, hint }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      <div className="card-hint">{hint}</div>
    </div>
  );
}
