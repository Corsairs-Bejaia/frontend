import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ShieldCheck, Upload, FileText, Check, ArrowRight, ArrowLeft,
  Camera, Clock, Lock, Sparkles, Loader2, X, FileBadge,
  Award, CreditCard, Briefcase,
} from "lucide-react";

export const Route = createFileRoute("/verify/$token")({
  component: Wizard,
  head: () => ({ meta: [{ title: "Verify your credentials — Meayar" }] }),
});

const steps = ["Welcome", "Identity", "Documents", "Review", "Processing", "Result"] as const;
type Step = (typeof steps)[number];

const docTypes = [
  { key: "id", label: "National ID", required: true, icon: CreditCard },
  { key: "cnas", label: "CNAS Affiliation", required: true, icon: FileBadge },
  { key: "diploma", label: "Medical Diploma", required: true, icon: Award },
  { key: "agreement", label: "Work Agreement", required: false, icon: Briefcase },
] as const;

function Wizard() {
  const [step, setStep] = useState<Step>("Welcome");
  const [consent, setConsent] = useState(false);
  const [uploads, setUploads] = useState<Record<string, boolean>>({});

  const stepIndex = steps.indexOf(step);
  const requiredDone = docTypes.filter((d) => d.required).every((d) => uploads[d.key]);

  return (
    <div className="min-h-screen w-full">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid place-items-center h-8 w-8 rounded-lg bg-primary/15 ring-1 ring-primary/30">
              <ShieldCheck className="h-4 w-4 text-primary-glow" />
            </div>
            <span className="font-display text-base font-semibold">Meayar</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span className="font-mono uppercase tracking-wider text-[10px]">Encrypted · Law 18-07</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mx-auto max-w-3xl px-6 pb-4">
          <div className="flex items-center gap-1.5">
            {steps.map((s, i) => (
              <div
                key={s}
                className="flex-1 h-1 rounded-full overflow-hidden bg-muted"
              >
                <motion.div
                  initial={false}
                  animate={{ width: i <= stepIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: i < stepIndex ? "var(--success)" :
                      i === stepIndex ? "linear-gradient(90deg, var(--primary), var(--primary-glow))" :
                      "transparent",
                    boxShadow: i === stepIndex ? "0 0 8px var(--primary-glow)" : undefined,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">{step}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <AnimatePresence mode="wait">
          {step === "Welcome" && (
            <Frame key="welcome">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="relative mx-auto h-20 w-20 grid place-items-center"
                >
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                  <div className="relative grid place-items-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary-glow glow-ring">
                    <ShieldCheck className="h-9 w-9 text-primary-foreground" />
                  </div>
                </motion.div>
                <h1 className="mt-8 font-display text-4xl md:text-5xl font-semibold tracking-tight">
                  Verify your <span className="text-gradient">medical credentials</span>
                </h1>
                <p className="mt-4 max-w-md mx-auto text-muted-foreground">
                  A short, secure flow to confirm your identity and qualifications. Your data is encrypted end-to-end.
                </p>
                <div className="mt-10 grid grid-cols-2 gap-2 max-w-md mx-auto text-left">
                  {docTypes.map((d) => (
                    <div key={d.key} className="rounded-lg border border-border bg-surface p-3 flex items-center gap-2.5">
                      <d.icon className="h-4 w-4 text-primary-glow shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{d.label}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{d.required ? "Required" : "Optional"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface ring-1 ring-border px-3 py-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  About 5–10 minutes
                </div>

                <label className="mt-8 flex items-start gap-3 max-w-md mx-auto text-left text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border bg-surface accent-primary"
                  />
                  <span className="text-muted-foreground">
                    I consent to Meayar processing my documents in accordance with <span className="text-foreground underline">Law 18-07</span> on personal data protection.
                  </span>
                </label>

                <button
                  disabled={!consent}
                  onClick={() => setStep("Identity")}
                  className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed glow-ring"
                >
                  Begin verification
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Frame>
          )}

          {step === "Identity" && (
            <Frame key="identity">
              <h2 className="font-display text-3xl font-semibold tracking-tight">Confirm your identity</h2>
              <p className="mt-2 text-muted-foreground">
                We use a third-party KYC provider (Sumsub) for liveness and ID verification.
              </p>

              <div className="mt-8 rounded-xl border border-border bg-surface p-8 text-center">
                <div className="mx-auto h-16 w-16 grid place-items-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                  <Camera className="h-7 w-7 text-primary-glow" />
                </div>
                <p className="mt-5 font-medium">Take a quick selfie & scan your ID</p>
                <p className="mt-1 text-xs text-muted-foreground">Hold your camera steady — this takes ~30 seconds.</p>
                <button
                  onClick={() => setStep("Documents")}
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-ring"
                >
                  Open camera
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setStep("Documents")}
                  className="block mx-auto mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Skip (demo mode)
                </button>
              </div>

              <NavRow onBack={() => setStep("Welcome")} />
            </Frame>
          )}

          {step === "Documents" && (
            <Frame key="docs">
              <h2 className="font-display text-3xl font-semibold tracking-tight">Upload your documents</h2>
              <p className="mt-2 text-muted-foreground">PDF, JPG or PNG · max 10 MB each. Make sure they're clearly readable.</p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {docTypes.map((d) => {
                  const uploaded = uploads[d.key];
                  return (
                    <button
                      key={d.key}
                      onClick={() => setUploads((u) => ({ ...u, [d.key]: !u[d.key] }))}
                      className={`relative text-left rounded-xl border p-4 transition-all ${
                        uploaded
                          ? "border-success/50 bg-success/10"
                          : "border-border bg-surface hover:border-border-strong hover:bg-surface-elevated"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`grid place-items-center h-9 w-9 rounded-lg shrink-0 ${
                          uploaded ? "bg-success/20 text-success" : "bg-primary/15 text-primary-glow ring-1 ring-primary/30"
                        }`}>
                          {uploaded ? <Check className="h-4 w-4" /> : <d.icon className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{d.label}</p>
                            {d.required && (
                              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Required</span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {uploaded ? "Uploaded · click to remove" : "Click to upload"}
                          </p>
                        </div>
                        {uploaded ? (
                          <X className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <NavRow
                onBack={() => setStep("Identity")}
                onNext={requiredDone ? () => setStep("Review") : undefined}
                nextLabel="Review"
              />
            </Frame>
          )}

          {step === "Review" && (
            <Frame key="review">
              <h2 className="font-display text-3xl font-semibold tracking-tight">Looks right?</h2>
              <p className="mt-2 text-muted-foreground">A quick check before we run the full verification.</p>

              <div className="mt-8 space-y-2">
                {docTypes.filter((d) => uploads[d.key]).map((d) => (
                  <div key={d.key} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                    <div className="grid place-items-center h-9 w-9 rounded-md bg-success/15 text-success">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d.label}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">document.pdf · 2.4 MB</p>
                    </div>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>

              <NavRow
                onBack={() => setStep("Documents")}
                onNext={() => setStep("Processing")}
                nextLabel="Start verification"
              />
            </Frame>
          )}

          {step === "Processing" && <Processing key="proc" onDone={() => setStep("Result")} />}

          {step === "Result" && <Result key="result" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function NavRow({ onBack, onNext, nextLabel = "Continue" }: { onBack?: () => void; onNext?: () => void; nextLabel?: string }) {
  return (
    <div className="mt-10 flex items-center justify-between">
      {onBack ? (
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      ) : <span />}
      <button
        disabled={!onNext}
        onClick={onNext}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed glow-ring"
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

const procSteps = [
  { label: "Identity verified", duration: 2300 },
  { label: "Documents classified", duration: 1100 },
  { label: "Extracting data", duration: 4700 },
  { label: "Authenticity check", duration: 3200 },
  { label: "CNAS cross-reference", duration: 4200 },
  { label: "Consistency check", duration: 1800 },
  { label: "Calculating score", duration: 800 },
] as const;

function Processing({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState<number>(0);

  useEffect(() => {
    if (done >= procSteps.length) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), 800);
    return () => clearTimeout(t);
  }, [done, onDone]);

  return (
    <Frame>
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="mx-auto h-20 w-20 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent, var(--primary-glow), transparent)`,
            mask: "radial-gradient(circle, transparent 38px, black 39px, black 40px, transparent 41px)",
            WebkitMask: "radial-gradient(circle, transparent 38px, black 39px, black 40px, transparent 41px)",
          }}
        />
        <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight">Verifying your credentials</h2>
        <p className="mt-2 text-muted-foreground">Eight agents are reviewing your documents in parallel.</p>
      </div>

      <div className="mt-10 max-w-md mx-auto space-y-2">
        {procSteps.map((s, i) => {
          const isDone = i < done;
          const isActive = i === done;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                isDone ? "border-success/30 bg-success/5" :
                isActive ? "border-primary/40 bg-primary/10" :
                "border-border bg-surface"
              }`}
            >
              <div className={`grid place-items-center h-7 w-7 rounded-full ring-1 ${
                isDone ? "bg-success/20 text-success ring-success/30" :
                isActive ? "bg-primary/20 text-primary-glow ring-primary/30" :
                "bg-muted text-muted-foreground ring-border"
              }`}>
                {isDone ? <Check className="h-3.5 w-3.5" /> : isActive ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span className="font-mono text-[10px]">{i + 1}</span>}
              </div>
              <span className={`text-sm flex-1 ${isDone || isActive ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              {isDone && <span className="font-mono text-[10px] text-muted-foreground">{(s.duration / 1000).toFixed(1)}s</span>}
              {isActive && <span className="font-mono text-[10px] text-primary-glow">in progress…</span>}
            </motion.div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        You can close this page — we'll email you the result.
      </p>
    </Frame>
  );
}

function Result() {
  return (
    <Frame>
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="relative mx-auto h-24 w-24"
        >
          <div className="absolute inset-0 rounded-full bg-success/30 blur-2xl" />
          <div className="relative grid place-items-center h-24 w-24 rounded-full bg-gradient-to-br from-success to-success/70">
            <Check className="h-11 w-11 text-success-foreground" strokeWidth={3} />
          </div>
        </motion.div>
        <h2 className="mt-8 font-display text-4xl md:text-5xl font-semibold tracking-tight">
          You're <span className="text-success">verified</span>.
        </h2>
        <p className="mt-3 max-w-md mx-auto text-muted-foreground">
          All eight checks passed. Your credentials have been confirmed and the result has been forwarded to the requesting platform.
        </p>

        <div className="mt-10 inline-flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-4">
          <Sparkles className="h-4 w-4 text-primary-glow" />
          <div className="text-left">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Verification score</p>
            <p className="font-display text-2xl font-semibold text-success">94 / 100</p>
          </div>
        </div>

        <div className="mt-10">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline">
            Return to Meayar
          </Link>
        </div>
      </div>
    </Frame>
  );
}
