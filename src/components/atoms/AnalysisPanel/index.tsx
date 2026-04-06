// src/components/atoms/AnalysisPanel.tsx
"use client";

import { Shield, Skull, AlertTriangle, List, X, Check } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { AnalysisData, DangerousCommand } from "@/app/types";

interface AnalysisPanelProps {
  analysisData: AnalysisData;
  detectedCommands?: DangerousCommand[];
  isCritical?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

export const AnalysisPanel = ({
  analysisData,
  detectedCommands = [],
  isCritical = false,
  onCancel,
  onConfirm,
  confirmLabel,
}: AnalysisPanelProps) => {
  const isDangerous = analysisData.riskColor === "red";

  return (
    <div
      className={cn(
        "animate-slide-up overflow-hidden rounded-xl",
        isDangerous
          ? "border border-red-500/20 bg-red-500/5"
          : "border border-accent-cyan/20 bg-bg-secondary",
      )}
    >
      {/* ── Header ── */}
      <div
        className={cn(
          "flex items-center gap-3 border-b border-border-custom p-4",
          isDangerous ? "bg-red-500/10" : "",
        )}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isDangerous
              ? "bg-red-500/10 text-red-500"
              : "bg-accent-cyan/10 text-accent-cyan",
          )}
        >
          {isDangerous ? (
            <Skull className="h-4 w-4" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
        </div>
        <div>
          <div className="text-sm font-bold text-text-primary">
            {isDangerous ? "Analisis Perintah Berbahaya" : "Analisis Perintah"}
          </div>
          <div className="text-[11px] text-text-muted">
            Review dampak sebelum eksekusi
          </div>
        </div>
      </div>

      {/* ── Command ── */}
      <div className="flex items-center gap-2 border-b border-border-custom px-4 py-2.5">
        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Perintah
        </span>
        <span
          className={cn(
            "truncate rounded-md border px-2.5 py-1 font-mono text-xs",
            isDangerous
              ? "border-red-500/20 bg-red-500/10 text-red-500"
              : "border-accent-cyan/10 bg-accent-cyan/5 text-accent-cyan",
          )}
        >
          {analysisData.command.length > 55
            ? analysisData.command.slice(0, 55) + "…"
            : analysisData.command}
        </span>
      </div>

      {/* ── Detected patterns ── */}
      {isDangerous && detectedCommands.length > 0 && (
        <div className="border-b border-border-custom bg-red-500/5 px-4 py-3">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-[11px] font-bold uppercase text-red-500">
              {isCritical
                ? "Pola Critical Terdeteksi"
                : "Pola Berbahaya Terdeteksi"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detectedCommands.map((cmd, idx) => (
              <span
                key={idx}
                title={cmd.desc}
                className="rounded-md border border-red-500/30 bg-red-500/20 px-2 py-1 text-[11px] font-medium text-red-500"
              >
                {cmd.pattern}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">
          <List className="h-3.5 w-3.5 text-accent-cyan" />
          Yang akan terjadi
        </div>
        <ul className="mb-4 space-y-1.5">
          {analysisData.impacts.map((impact, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-[13px] leading-relaxed text-text-secondary"
            >
              <span
                className={cn(
                  "mt-2 h-1 w-1 flex-shrink-0 rounded-full",
                  isDangerous ? "bg-red-400" : "bg-accent-cyan",
                )}
              />
              {impact}
            </li>
          ))}
        </ul>

        {/* Stats */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border-custom bg-surface-hover px-3.5 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Durasi
            </span>
            <span className="text-[13px] font-bold text-accent-cyan">
              {analysisData.duration}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border-custom bg-surface-hover px-3.5 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Space
            </span>
            <span className="text-[13px] font-bold text-accent-green">
              {analysisData.space}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border-custom bg-surface-hover px-3.5 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Risk
            </span>
            <span
              className={cn(
                "text-[13px] font-bold",
                analysisData.riskColor === "green" && "text-accent-green",
                analysisData.riskColor === "amber" && "text-accent-amber",
                analysisData.riskColor === "red" && "text-red-500",
              )}
            >
              {analysisData.risk}
            </span>
          </div>
        </div>

        {/* Critical warning */}
        {isCritical && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-xs leading-relaxed text-text-secondary">
                Perintah ini memiliki risiko{" "}
                <strong className="text-red-500">CRITICAL</strong>. Dapat
                menyebabkan kehilangan data permanen atau downtime total.
                Pastikan Anda memiliki backup dan change approval.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="bg-overlay flex justify-end gap-2 border-t border-border-custom px-4 py-3">
        <button
          onClick={onCancel}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[13px] font-semibold transition-all",
            isDangerous
              ? "border-red-500/20 bg-surface text-text-secondary hover:bg-red-500/10 hover:text-red-500"
              : "border-border-custom bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary",
          )}
        >
          <X className="h-4 w-4" />
          Batal
        </button>
        <button
          onClick={onConfirm}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-all",
            isDangerous
              ? "bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_0_16px_rgba(255,0,0,0.3)]"
              : "bg-accent-cyan text-bg-primary hover:opacity-90",
          )}
        >
          <Check className="h-4 w-4" />
          {confirmLabel ?? (isCritical ? "Lanjutkan (Critical)" : "Lanjutkan")}
        </button>
      </div>
    </div>
  );
};
