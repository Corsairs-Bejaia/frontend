import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft, Check, X, AlertTriangle, Loader2, FileText,
  ChevronDown, Sparkles, ShieldCheck, ShieldAlert,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { getVerificationDetail, type VerificationDetail as TVerificationDetail } from "@/lib/mock-data";

export const Route = createFileRoute("/verifications/$id")({
  component: VerificationDetail,
  loader: ({ params }) => {
    const detail = getVerificationDetail(params.id);
    if (!detail) throw notFound();
    return { detail };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.detail.ref ?? "Verification"} — MediVerify` }],
  }),
  errorComponent: ({ error }) => (
    <AppShell title="Verification">
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell title="Not found">
      <p className="text-muted-foreground">No verification matches this ID.</p>
    </AppShell>
  ),
});

function VerificationDetail() {
  const data = Route.useLoaderData() as { detail: TVerificationDetail };
  const { detail } = data;
  const [openDoc, setOpenDoc] = useState<string | null>(detail.extracted[0]?.documentLabel ?? null);
  const [showTrace, setShowTrace] = useState(true);

  const scoreColor =
    detail.score >= 85 ? "var(--success)" : detail.score >= 50 ? "var(--warning)" : "var(--destructive)";

  return (
    <AppShell title={detail.ref} subtitle="Full verification report with agent trace">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-6 justify-between rounded-xl border border-border bg-surface p-6">
        <div className="flex items-start gap-4 min-w-0">
          <Link
            to="/verifications"
            className="grid place-items-center h-9 w-9 rounded-md bg-surface-elevated ring-1 ring-border hover:bg-accent transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{detail.ref}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">{detail.doctorName}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={detail.status} />
              <span className="text-xs text-muted-foreground">{detail.specialty}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="font-mono text-xs text-muted-foreground">{detail.nationalId}</span>
            </div>
          </div>
        </div>

        {/* Score ring */}
        <div className="flex items-center gap-5">
          <div className="relative h-24 w-24">
            <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="2.5" />
              <motion.circle
                cx="18" cy="18" r="15" fill="none"
                stroke={scoreColor} strokeWidth="2.5" strokeLinecap="round"
                initial={{ strokeDasharray: "0 94" }}
                animate={{ strokeDasharray: `${(detail.score / 100) * 94} 94` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ filter: `drop-shadow(0 0 6px ${scoreColor})` }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="font-display text-2xl font-semibold tabular-nums" style={{ color: scoreColor }}>{detail.score}</div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">/ 100</div>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Final score</p>
            <p className="mt-1 text-sm">
              {detail.score >= 85 ? "Above auto-approve threshold (80)" :
                detail.score >= 50 ? "In manual-review band (50–79)" :
                "Below review threshold"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Processed in {detail.processingTime}</p>
          </div>
        </div>
      </div>

      {/* Pipeline stepper */}
      <div className="mt-6 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base font-semibold">Pipeline</h3>
          <button
            onClick={() => setShowTrace((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            {showTrace ? "Hide" : "Show"} agent trace
          </button>
        </div>

        <div className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {detail.agentSteps.map((s, i) => {
            const icon =
              s.status === "done" ? <Check className="h-3.5 w-3.5" /> :
              s.status === "active" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> :
              s.status === "failed" ? <X className="h-3.5 w-3.5" /> :
              <span className="font-mono text-[10px]">{i + 1}</span>;
            const color =
              s.status === "done" ? "var(--success)" :
              s.status === "active" ? "var(--primary-glow)" :
              s.status === "failed" ? "var(--destructive)" :
              "var(--muted-foreground)";
            return (
              <div key={s.id} className="relative rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <div
                    className="grid place-items-center h-6 w-6 rounded-full ring-1"
                    style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color, borderColor: color }}
                  >
                    {icon}
                  </div>
                  {s.duration && <span className="ml-auto font-mono text-[10px] text-muted-foreground">{s.duration}</span>}
                </div>
                <p className="mt-2 text-xs font-medium leading-tight">{s.label}</p>
                {s.confidence !== undefined && (
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">conf {(s.confidence * 100).toFixed(0)}%</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Agent trace */}
        <AnimatePresence>
          {showTrace && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-lg border border-border bg-background p-4 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Agent execution trace</p>
                {detail.agentSteps.filter((s) => s.tools?.length).map((s) => (
                  <div key={s.id} className="font-mono text-xs space-y-1">
                    <p className="text-muted-foreground">▸ {s.label}</p>
                    {s.tools!.map((t, i) => (
                      <div key={i} className="ml-4 flex items-center gap-2">
                        <span className={t.outcome === "pass" ? "text-success" : "text-destructive"}>
                          {t.outcome === "pass" ? "✓" : "✗"}
                        </span>
                        <span>{t.name}</span>
                        <span className="text-muted-foreground">conf {t.confidence.toFixed(2)}</span>
                        {t.outcome === "pass" && i === s.tools!.length - 1 && (
                          <span className="text-success">→ accepted</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Two-col: Extracted + Documents */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-base font-semibold">Extracted data</h3>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">By document</p>

          <div className="mt-4 space-y-2">
            {detail.extracted.map((doc) => {
              const isOpen = openDoc === doc.documentLabel;
              return (
                <div key={doc.documentLabel} className="rounded-lg border border-border bg-background overflow-hidden">
                  <button
                    onClick={() => setOpenDoc(isOpen ? null : doc.documentLabel)}
                    className="w-full flex items-center gap-3 p-3.5 hover:bg-surface-elevated transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary-glow" />
                    <span className="font-medium text-sm">{doc.documentLabel}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{doc.fields.length} fields</span>
                    <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border divide-y divide-border">
                          {doc.fields.map((f) => {
                            const cf = f.confidence;
                            const cfColor = cf >= 0.85 ? "var(--success)" : cf >= 0.6 ? "var(--warning)" : "var(--destructive)";
                            return (
                              <div key={f.label} className="grid grid-cols-3 gap-3 px-4 py-2.5 text-sm">
                                <p className="text-muted-foreground text-xs">{f.label}</p>
                                <p className="col-span-1 truncate">{f.value}</p>
                                <div className="flex items-center justify-end gap-2">
                                  <div className="h-1 w-12 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${cf * 100}%`, background: cfColor }} />
                                  </div>
                                  <span className="font-mono text-[10px] tabular-nums" style={{ color: cfColor }}>
                                    {(cf * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-base font-semibold">Documents</h3>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Authenticity check</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {detail.documents.map((d) => (
              <div key={d.type} className="relative rounded-lg border border-border bg-background p-3 group overflow-hidden">
                <div className="aspect-[3/4] rounded-md bg-gradient-to-br from-surface-elevated to-background ring-1 ring-border grid place-items-center mb-2 relative overflow-hidden">
                  <FileText className="h-6 w-6 text-muted-foreground/40" />
                  {d.status === "authentic" && (
                    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-success to-transparent animate-scan" />
                  )}
                </div>
                <p className="text-xs font-medium truncate">{d.type}</p>
                <div className="mt-1 flex items-center gap-1">
                  {d.status === "authentic" ? (
                    <ShieldCheck className="h-3 w-3 text-success" />
                  ) : (
                    <ShieldAlert className="h-3 w-3 text-warning" />
                  )}
                  <span className={`font-mono text-[10px] ${d.status === "authentic" ? "text-success" : "text-warning"}`}>
                    {(d.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consistency + Score breakdown */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-base font-semibold">Consistency checks</h3>
          <ul className="mt-4 space-y-2">
            {detail.consistency.map((c, i) => {
              const icon = c.status === "pass" ? <Check className="h-3.5 w-3.5" /> :
                c.status === "fail" ? <X className="h-3.5 w-3.5" /> :
                <AlertTriangle className="h-3.5 w-3.5" />;
              const color = c.status === "pass" ? "var(--success)" : c.status === "fail" ? "var(--destructive)" : "var(--warning)";
              return (
                <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                  <div
                    className="grid place-items-center h-6 w-6 rounded-full shrink-0"
                    style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color }}
                  >
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{c.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-base font-semibold">Score breakdown</h3>
          <div className="mt-4 space-y-3">
            {detail.tiers.map((t) => {
              const c = t.score >= 85 ? "var(--success)" : t.score >= 50 ? "var(--warning)" : "var(--destructive)";
              return (
                <div key={t.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm">{t.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      <span className="text-foreground tabular-nums" style={{ color: c }}>{t.score}</span> · weight {t.weight}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: c, boxShadow: `0 0 8px ${c}` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {detail.blockers.length > 0 && (
            <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-destructive mb-2">Blockers</p>
              <ul className="space-y-1">
                {detail.blockers.map((b, i) => (
                  <li key={i} className="text-xs text-destructive flex items-start gap-2">
                    <X className="h-3 w-3 mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Manual review actions */}
      {detail.status === "review" && (
        <div className="mt-6 rounded-xl border border-warning/30 bg-warning/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="font-display text-base font-semibold">Awaiting manual decision</h3>
          </div>
          <textarea
            placeholder="Add review notes (required)…"
            rows={3}
            className="w-full rounded-md bg-background ring-1 ring-border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-primary"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md bg-success px-4 py-2 text-sm font-medium text-success-foreground hover:opacity-90 transition-opacity">
              <Check className="h-3.5 w-3.5" /> Approve
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 transition-opacity">
              <X className="h-3.5 w-3.5" /> Reject
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-surface-elevated px-4 py-2 text-sm font-medium ring-1 ring-border hover:bg-accent transition-colors">
              Request more documents
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
