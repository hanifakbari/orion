"use client";

import { useState } from "react";
import Image from "next/image";
import {
  QUICK_PROMPTS,
  DANGEROUS_COMMANDS,
  ANALYSIS_DATABASE,
} from "@/app/lib/constants";
import type { AnalysisData, DangerousCommand, QuickPrompt } from "@/app/types";
import { AnalysisPanel, CommandInput, SafetyWarning } from "@/components";
import { Assets } from "@/assets";

interface WelcomeScreenProps {
  onStartChat: (message: string, analysisData?: AnalysisData) => void;
  onQuickPrompt: (prompt: QuickPrompt) => void;
}

export const WelcomeScreen = ({
  onStartChat,
  onQuickPrompt,
}: WelcomeScreenProps) => {
  const [input, setInput] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isCritical, setIsCritical] = useState(false);
  const [isSafetyWarning, setIsSafetyWarning] = useState(false);
  const [detectedCommands, setDetectedCommands] = useState<DangerousCommand[]>(
    [],
  );

  const checkDangerousCommands = (text: string): DangerousCommand[] => {
    const detected: DangerousCommand[] = [];
    DANGEROUS_COMMANDS.forEach((cmd) => {
      const regex = new RegExp(
        cmd.pattern
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\\\*/g, ".*"),
        "i",
      );
      if (regex.test(text.toLowerCase())) detected.push(cmd);
    });
    return detected;
  };

  const checkDangerousCommandsState = (text: string) => {
    const detected = checkDangerousCommands(text);
    if (detected.length > 0) {
      setDetectedCommands(detected);
      setIsCritical(detected.some((d) => d.level === "critical"));
      setIsSafetyWarning(true);
      return true;
    } else {
      setDetectedCommands([]);
      setIsCritical(false);
      setIsSafetyWarning(false);
      return false;
    }
  };

  const getAnalysis = (cmd: string): AnalysisData => {
    const lower = cmd.toLowerCase();
    for (const a of ANALYSIS_DATABASE) {
      for (const pat of a.patterns) {
        const escaped = pat
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\\\*/g, ".*");
        if (new RegExp(escaped, "i").test(lower)) return { ...a, command: cmd };
      }
    }
    return {
      command: cmd,
      impacts: [
        `Perintah "${cmd}" akan dieksekusi di sistem`,
        "Output akan ditampilkan di chat",
        "Pastikan Anda memahami hasil yang diharapkan",
      ],
      duration: "< 5 detik",
      space: "-",
      risk: "Safe",
      riskColor: "green",
    };
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    const detected = checkDangerousCommands(input);
    const analysis = getAnalysis(input);
    const commandIsCritical = detected.some((d) => d.level === "critical");

    setDetectedCommands(detected);
    setIsCritical(commandIsCritical);
    setAnalysisData(analysis);

    if (commandIsCritical) {
      // CRITICAL: safety warning dulu, analysis belum muncul
      setIsSafetyWarning(true);
      setShowAnalysis(false);
    } else {
      // WARNING atau safe: langsung analysis
      setIsSafetyWarning(false);
      setShowAnalysis(true);
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    checkDangerousCommandsState(val);
    if (showAnalysis && val !== analysisData?.command) {
      setShowAnalysis(false);
      setAnalysisData(null);
    }
  };

  const handleCancel = () => {
    setShowAnalysis(false);
    setAnalysisData(null);
    setDetectedCommands([]);
    setIsSafetyWarning(false);
    setIsCritical(false);
    setInput("");
  };

  const handleConfirm = () => {
    if (!analysisData) return;
    onStartChat(input.trim(), analysisData);
  };

  return (
    <section
      aria-label="Welcome screen"
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col items-center justify-center px-12 py-14">
          {/* Title */}
          <header className="my-12 flex flex-col items-center justify-center gap-6 text-center">
            <div className="flex items-center justify-center">
              <Image
                src={Assets.Orion}
                alt="Orion Logo"
                width={48}
                height={48}
                className="h-32 w-32"
              />
            </div>
            <p className="max-w-2xl text-[17px] leading-relaxed text-text-secondary">
              AI-powered infrastructure control. Monitor, automate, and optimize
              your systems with intelligent agent assistance.
            </p>
          </header>

          {/* Quick Prompts */}
          <section aria-label="Quick prompts" className="my-8 w-full max-w-3xl">
            <h2 className="my-4 text-center text-sm font-semibold text-text-secondary">
              Quick Prompts
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => onQuickPrompt(prompt)}
                  className="rounded-xl border border-border-custom bg-surface p-5 text-left transition-all hover:border-accent-cyan hover:bg-surface-hover"
                >
                  <div className="my-2 text-sm font-semibold text-text-primary">
                    {prompt.title}
                  </div>
                  <div className="text-xs leading-relaxed text-text-secondary">
                    {prompt.description}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Input */}
          <div className="my-2 w-full max-w-3xl">
            <CommandInput
              value={input}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              isSafetyWarning={isSafetyWarning}
              isCritical={isCritical}
            />
            <p className="mt-2 text-center text-[11px] text-text-muted">
              Enter untuk analisis • Shift+Enter baris baru
            </p>
          </div>

          {/* Safety Warning */}
          {isSafetyWarning && (
            <div className="my-3 w-full max-w-3xl">
              <SafetyWarning
                isCritical={isCritical}
                detectedCommands={detectedCommands}
                onCancel={handleCancel}
                onContinue={() => {
                  setIsSafetyWarning(false);
                  setShowAnalysis(true);
                  handleSubmit();
                }}
              />
            </div>
          )}

          {/* Analysis Panel */}
          {showAnalysis && analysisData && (
            <div className="my-6 w-full max-w-3xl">
              <AnalysisPanel
                analysisData={analysisData}
                detectedCommands={detectedCommands}
                isCritical={isCritical}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
              />
            </div>
          )}

          {/* System Context */}
          <aside className="w-full max-w-3xl rounded-xl border border-border-custom bg-surface p-5">
            <div className="my-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              <span>⚙</span> System Context
            </div>
            <p className="text-[13px] leading-relaxed text-text-secondary">
              Production environment with 3-node Kubernetes cluster.
              Auto-scaling enabled, monitoring via Prometheus/Grafana. Prefer
              dry-run for destructive operations.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};
