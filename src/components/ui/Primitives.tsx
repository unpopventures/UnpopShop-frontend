import { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function StatCard({
  icon,
  label,
  value,
  delta,
  action,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  delta?: number;
  action?: ReactNode;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-200 text-forest-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-forest-400">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-display font-semibold text-forest-700">{value}</p>
          {typeof delta === "number" && (
            <span
              className={`flex items-center gap-0.5 text-xs font-semibold ${
                delta >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {delta >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
      </div>
      {action}
    </Card>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "gold";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-cream-200 text-forest-600",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-600",
    gold: "bg-gold-100 text-gold-700",
  };
  return <span className={`badge ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-forest-200 bg-cream-50 px-6 py-14 text-center">
      <h3 className="font-display text-lg text-forest-600">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-forest-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-forest-400">
      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-forest-200 border-t-gold-500" />
      {label}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h3 className="font-display text-lg text-forest-700">{title}</h3>
      </div>
      {action}
    </div>
  );
}
