import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { X, CheckCircle, Clock, Award } from "lucide-react";
import type { Verification } from "@/lib/mock-data";

interface DoctorDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Verification | null;
}

export function DoctorDetailModal({ open, onOpenChange, doctor }: DoctorDetailModalProps) {
  if (!doctor) return null;

  const initials = doctor.doctorName.replace("Dr. ", "").split(" ").map((s) => s[0]).slice(0, 2).join("");
  const bgGradient = doctor.status === "approved" 
    ? "from-success/20 to-success/5" 
    : doctor.status === "review"
    ? "from-warning/20 to-warning/5"
    : "from-destructive/20 to-destructive/5";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="relative">
          <div className="absolute -inset-6 opacity-40 blur-xl bg-gradient-to-br from-primary/30 to-transparent rounded-2xl" />
          <div className="relative">
            <DialogTitle className="text-2xl">{doctor.doctorName}</DialogTitle>
            <DialogDescription className="text-base mt-2">{doctor.specialty}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status and score row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-surface p-4 border border-border">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Status</p>
              <StatusBadge status={doctor.status} />
            </div>

            <div className="rounded-lg bg-surface p-4 border border-border">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Score</p>
              <div className="flex items-baseline gap-1">
                <p className="font-display text-3xl font-semibold tabular-nums">{doctor.score}</p>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>

            <div className="rounded-lg bg-surface p-4 border border-border">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Ref</p>
              <p className="font-mono text-sm text-foreground">{doctor.ref}</p>
            </div>
          </div>

          {/* Timeline info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-surface p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary-glow" />
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Processing time</p>
              </div>
              <p className="font-display text-lg font-semibold">{doctor.processingTime}</p>
            </div>

            <div className="rounded-lg bg-surface p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-success" />
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Submitted</p>
              </div>
              <p className="font-display text-lg font-semibold">{doctor.submittedAt}</p>
            </div>
          </div>

          {/* Personal info */}
          <div className="rounded-lg bg-gradient-to-br border border-border p-6 space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider mb-1">National ID</p>
                <p className="font-mono text-foreground">{doctor.nationalId.slice(0, 8)}···· ···· ····</p>
              </div>

              <div>
                <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider mb-1">Specialty</p>
                <p className="text-foreground font-medium">{doctor.specialty}</p>
              </div>

              <div>
                <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider mb-1">Verification ID</p>
                <p className="font-mono text-foreground">{doctor.id}</p>
              </div>

              <div>
                <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider mb-1">Flags</p>
                <div className="flex items-center gap-2">
                  {doctor.flags === 0 ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-foreground font-medium">No flags</span>
                    </>
                  ) : (
                    <span className="text-warning font-medium">{doctor.flags} flag{doctor.flags !== 1 ? "s" : ""}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="rounded-lg bg-surface p-4 border border-border">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: "Identity Match", value: 96 },
                { label: "Document Authenticity", value: 89 },
                { label: "Credential Verification", value: doctor.score },
                { label: "Consistency Check", value: 92 },
              ].map((tier, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{tier.label}</span>
                    <span className="font-mono font-semibold text-foreground">{tier.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                      style={{ width: `${tier.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button className="flex-1 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 font-medium text-sm hover:bg-primary/90 transition-colors">
              View Full Report
            </button>
            <button className="flex-1 rounded-lg border border-border bg-surface text-foreground px-4 py-2.5 font-medium text-sm hover:bg-surface-elevated transition-colors">
              Export Details
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
