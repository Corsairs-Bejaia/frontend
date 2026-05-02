import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Filter, Download, Eye } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge, ScoreBar } from "@/components/status-badge";
import { verifications, type VerificationStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/verifications/")({
  component: VerificationsList,
  head: () => ({ meta: [{ title: "Verifications — MediVerify" }] }),
});

const statusFilters: { key: VerificationStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "processing", label: "Processing" },
  { key: "approved", label: "Approved" },
  { key: "review", label: "Review" },
  { key: "rejected", label: "Rejected" },
];

function VerificationsList() {
  const [filter, setFilter] = useState<VerificationStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = verifications.filter((v) => {
    if (filter !== "all" && v.status !== filter) return false;
    if (query && !v.doctorName.toLowerCase().includes(query.toLowerCase()) && !v.nationalId.includes(query)) return false;
    return true;
  });

  return (
    <AppShell title="Verifications" subtitle={`${filtered.length} of ${verifications.length} records`}>
      {/* Filter bar */}
      <div className="rounded-xl border border-border bg-surface p-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-md bg-background p-0.5 ring-1 ring-border">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                filter === f.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter === f.key && (
                <motion.div
                  layoutId="filter-active"
                  className="absolute inset-0 bg-primary/15 ring-1 ring-primary/30 rounded"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-[180px] flex items-center gap-2 rounded-md bg-background px-3 py-1.5 ring-1 ring-border">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by doctor or national ID…"
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <button className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-xs font-medium ring-1 ring-border hover:bg-surface-elevated transition-colors">
          <Filter className="h-3.5 w-3.5" /> Date range
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary-glow ring-1 ring-primary/30 hover:bg-primary/25 transition-colors">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/60">
                {["Ref", "Doctor", "Specialty", "National ID", "Status", "Score", "Submitted", "Time", ""].map((h) => (
                  <th key={h} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-5 py-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.025 }}
                  className="border-b border-border/60 last:border-0 hover:bg-surface-elevated/40 transition-colors group"
                >
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{v.ref}</td>
                  <td className="px-5 py-3 font-medium">{v.doctorName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.specialty}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {v.nationalId.slice(0, 8)}<span className="opacity-40">····</span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-5 py-3">{v.status === "processing" ? <span className="text-xs text-muted-foreground">—</span> : <ScoreBar score={v.score} />}</td>
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

        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface/50">
          <p className="text-xs text-muted-foreground">
            Showing <span className="text-foreground font-medium">1–{filtered.length}</span> of <span className="text-foreground font-medium">{verifications.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 text-xs rounded ring-1 ring-border bg-background text-muted-foreground">Previous</button>
            <button className="px-2.5 py-1 text-xs rounded ring-1 ring-primary/30 bg-primary/15 text-primary-glow">1</button>
            <button className="px-2.5 py-1 text-xs rounded ring-1 ring-border bg-background hover:bg-surface-elevated">Next</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
