import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, ChevronRight, Eye } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { StatusBadge, ScoreBar } from "@/components/status-badge";
import { kpis, timeline, distribution, verifications } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — MediVerify" }] }),
});

function Dashboard() {
  return (
    <AppShell title="Command center" subtitle="Real-time view of every verification flowing through your tenant">
      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total verifications" value={kpis.total.value.toLocaleString()} change={kpis.total.change} accent="primary" />
        <KpiCard label="Approval rate" value={`${kpis.approvalRate.value}%`} change={kpis.approvalRate.change} accent="success" ring={kpis.approvalRate.value} />
        <KpiCard label="Pending reviews" value={kpis.pendingReviews.value.toString()} change={kpis.pendingReviews.change} accent="warning" />
        <KpiCard label="Avg processing" value={`${kpis.avgTime.value} m`} change={kpis.avgTime.change} accent="primary" inverted />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2 p-5">
          <PanelHeader title="Verification volume" subtitle="Last 7 days" />
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g-total" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-glow)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary-glow)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  cursor={{ stroke: "var(--border-strong)" }}
                />
                <Line type="monotone" dataKey="total" stroke="var(--primary-glow)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="approved" stroke="var(--success)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rejected" stroke="var(--destructive)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
            <Legend color="var(--primary-glow)" label="Total" />
            <Legend color="var(--success)" label="Approved" />
            <Legend color="var(--destructive)" label="Rejected" />
          </div>
        </Panel>

        <Panel className="p-5">
          <PanelHeader title="Status distribution" subtitle="All-time" />
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3} stroke="none">
                  {distribution.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {distribution.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto font-mono tabular-nums">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Recent table */}
      <Panel className="mt-6">
        <div className="flex items-center justify-between p-5 pb-3">
          <PanelHeader title="Recent verifications" subtitle="Live feed" />
          <Link to="/verifications" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-surface/50">
                {["Doctor", "Specialty", "National ID", "Status", "Score", "Submitted", "Time", ""].map((h) => (
                  <th key={h} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-5 py-2.5 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {verifications.slice(0, 8).map((v, i) => (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/60 hover:bg-surface/40 transition-colors group"
                >
                  <td className="px-5 py-3">
                    <div className="font-medium">{v.doctorName}</div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{v.specialty}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {v.nationalId.slice(0, 8)}<span className="opacity-40">····</span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-5 py-3">{v.status === "processing" ? <span className="text-muted-foreground text-xs">—</span> : <ScoreBar score={v.score} />}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{v.submittedAt}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{v.processingTime}</td>
                  <td className="px-5 py-3">
                    <Link
                      to="/verifications/$id"
                      params={{ id: v.id }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity inline-grid place-items-center h-7 w-7 rounded-md bg-surface-elevated ring-1 ring-border hover:bg-primary/15 hover:ring-primary/30"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}

function KpiCard({
  label, value, change, accent, inverted = false, ring,
}: {
  label: string; value: string; change: number;
  accent: "primary" | "success" | "warning"; inverted?: boolean; ring?: number;
}) {
  const positive = inverted ? change < 0 : change > 0;
  const accentVar = accent === "primary" ? "var(--primary-glow)" : accent === "success" ? "var(--success)" : "var(--warning)";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-xl border border-border bg-surface p-5 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentVar}, transparent)` }} />
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-display text-3xl font-semibold tabular-nums">{value}</p>
        {ring !== undefined && (
          <div className="relative h-12 w-12">
            <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke={accentVar} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${(ring / 100) * 88} 88`}
                style={{ filter: `drop-shadow(0 0 4px ${accentVar})` }}
              />
            </svg>
          </div>
        )}
      </div>
      <div className={`mt-3 inline-flex items-center gap-1 font-mono text-[11px] ${positive ? "text-success" : "text-destructive"}`}>
        {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        {Math.abs(change)}% vs last week
      </div>
    </motion.div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-surface ${className}`}>{children}</div>;
}

function PanelHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {label}
    </div>
  );
}
