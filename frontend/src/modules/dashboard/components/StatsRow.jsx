import { StatCard } from "./StatCard.jsx";

export function StatsRow({ stats }) {
  return <div className="row stats-row">{stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</div>;
}
