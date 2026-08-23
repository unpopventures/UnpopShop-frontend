interface Row {
  label: string;
  value: number;
  level: "High" | "Medium" | "Low";
  meta?: string;
}

const levelColor: Record<string, string> = {
  High: "bg-peacock",
  Medium: "bg-gold-500",
  Low: "bg-forest-200",
};

const levelTone: Record<string, string> = {
  High: "text-peacock",
  Medium: "text-gold-600",
  Low: "text-forest-400",
};

export default function RegionBars({ rows }: { rows: Row[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));

  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-forest-400">No data yet for this filter.</p>;
  }

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-forest-700">{row.label}</span>
            <span className={`text-xs font-semibold ${levelTone[row.level]}`}>
              {row.level} {row.meta ? `· ${row.meta}` : ""}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200">
            <div
              className={`h-full rounded-full ${levelColor[row.level]}`}
              style={{ width: `${Math.max(6, (row.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
