import { ReactNode } from "react";
import { EmptyState, LoadingBlock } from "../ui/Primitives";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export default function AdminTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  emptyTitle = "Nothing here yet",
  emptyDescription,
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (loading) return <LoadingBlock />;
  if (rows.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-forest-100 bg-white shadow-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-forest-100 bg-cream-50 text-xs font-semibold uppercase tracking-wide text-forest-400">
            {columns.map((c, i) => (
              <th key={i} className={`px-4 py-3 ${c.className || ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-forest-50 last:border-0 hover:bg-cream-50/60">
              {columns.map((c, i) => (
                <td key={i} className={`px-4 py-3.5 align-middle ${c.className || ""}`}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
