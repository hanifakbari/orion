"use client";

import { AlertTriangle, Skull, Shield, X } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface DetectedCommand {
  pattern: string;
  level: "critical" | "warning";
  desc: string;
}

interface SafetyWarningProps {
  isCritical: boolean;
  detectedCommands: DetectedCommand[];
  onCancel: () => void;
  onContinue: () => void;
}

export const SafetyWarning = ({
  isCritical,
  detectedCommands,
  onCancel,
  onContinue,
}: SafetyWarningProps) => {
  return (
    <div
      className={cn(
        "animate-slide-up rounded-xl p-4",
        isCritical
          ? "border-2 border-red-500/40 bg-red-500/10"
          : "border border-accent-red/25 bg-accent-red/5",
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            isCritical
              ? "bg-red-500/20 text-red-500"
              : "bg-accent-red/15 text-accent-red",
          )}
        >
          {isCritical ? (
            <Skull className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
        </div>
        <div>
          <div
            className={cn(
              "text-sm font-bold",
              isCritical ? "text-red-500" : "text-accent-red",
            )}
          >
            Perintah Destruktif Terdeteksi
          </div>
          <div className="mt-0.5 text-[11px] text-text-muted">
            {isCritical
              ? "Level CRITICAL — risiko sangat tinggi"
              : "Level WARNING — perlu konfirmasi"}
          </div>
        </div>
        <span
          className={cn(
            "ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
            isCritical
              ? "border border-red-500/30 bg-red-500/15 text-red-500"
              : "border border-accent-amber/30 bg-accent-amber/15 text-accent-amber",
          )}
        >
          {isCritical ? (
            <Skull className="h-2.5 w-2.5" />
          ) : (
            <AlertTriangle className="h-2.5 w-2.5" />
          )}
          {isCritical ? "CRITICAL" : "WARNING"}
        </span>
      </div>

      {/* Desc */}
      <p className="mb-3 text-[13px] leading-relaxed text-text-secondary">
        Perintah berikut dapat menyebabkan kehilangan data atau downtime sistem.
        Pastikan Anda telah melakukan backup dan memahami dampaknya.
      </p>

      {/* Detected patterns */}
      <div
        className={cn(
          "mb-4 flex flex-wrap gap-2 rounded-lg p-2.5 font-mono",
          isCritical
            ? "border border-red-500/15 bg-red-500/10"
            : "bg-accent-red/5",
        )}
      >
        {detectedCommands.map((cmd, idx) => (
          <span
            key={idx}
            title={cmd.desc}
            className={cn(
              "inline-block rounded-md px-2.5 py-1 text-xs font-medium",
              isCritical
                ? "bg-red-500/20 text-red-500"
                : "bg-accent-red/15 text-accent-red",
            )}
          >
            {cmd.pattern}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-border-custom bg-surface px-4 py-2.5 text-[13px] font-semibold text-text-secondary transition-all hover:border-accent-red hover:bg-surface-hover hover:text-text-primary"
        >
          <X className="h-4 w-4" />
          Batalkan
        </button>
        <button
          onClick={onContinue}
          className="flex items-center gap-2 rounded-lg bg-accent-cyan px-4 py-2.5 text-[13px] font-semibold text-bg-primary transition-all hover:opacity-90"
        >
          <Shield className="h-4 w-4" />
          Lanjutkan
        </button>
      </div>
    </div>
  );
};
