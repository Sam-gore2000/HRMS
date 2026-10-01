export function StatCard({ stat }) {
  return (
    <div className="col-lg-3 col-md-3 col-sm-6 col-6">
      <div className="stats-card">
        <div className="stats-icon"><i className={`bi ${stat.icon || "bi-grid"}`} /></div>
        <p className="stats-label">{stat.label}</p>
        <h2 className="stats-value">{stat.value}</h2>
        <span className="stats-meta neutral">{stat.meta}</span>
      </div>
    </div>
  );
}
