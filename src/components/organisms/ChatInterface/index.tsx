"use client";

import { useState, useRef, useEffect } from "react";
import {
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Play,
  Ban,
  Shield,
  Skull,
  AlertTriangle,
  Info,
  User,
  Bot,
  Database,
  RefreshCcw,
  Maximize2,
  Gauge,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import {
  DANGEROUS_COMMANDS,
  ANALYSIS_DATABASE,
  CHAT_SUGGESTIONS,
} from "@/app/lib/constants";
import type {
  Message,
  AnalysisData,
  DangerousCommand,
  ChatSuggestion,
  QuickPromptResponse,
} from "@/app/types";
import { formatTime } from "@/app/lib/utils";
import { AnalysisPanel, CommandInput, SafetyWarning } from "@/components";

interface ChatInterfaceProps {
  initialMessages?: Message[];
  initialAnalysis?: AnalysisData | null;
  initialPendingResponse?: QuickPromptResponse | null;
}

let messageIdCounter = 0;
const generateId = () => `msg_${++messageIdCounter}_${Date.now()}`;

export const ChatInterface = ({
  initialMessages = [],
  initialAnalysis,
  initialPendingResponse,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isSafetyWarning, setIsSafetyWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const [detectedCommands, setDetectedCommands] = useState<DangerousCommand[]>(
    [],
  );
  const [showAnalysis, setShowAnalysis] = useState(!!initialAnalysis);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(
    initialAnalysis || null,
  );
  const [pendingResponse, setPendingResponse] =
    useState<QuickPromptResponse | null>(initialPendingResponse || null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const checkDangerousCommands = (text: string) => {
    const detected: DangerousCommand[] = [];
    let maxSeverity: "critical" | "warning" | null = null;

    DANGEROUS_COMMANDS.forEach((cmd) => {
      const regex = new RegExp(
        cmd.pattern
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\\\*/g, ".*"),
        "i",
      );
      if (regex.test(text.toLowerCase())) {
        detected.push(cmd);
        if (
          !maxSeverity ||
          (cmd.level === "critical" && maxSeverity !== "critical")
        ) {
          maxSeverity = cmd.level;
        }
      }
    });

    if (detected.length > 0) {
      setDetectedCommands(detected);
      setIsCritical(maxSeverity === "critical");
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

  const handleSend = (overrideMessage?: string) => {
    const message = overrideMessage
      ? overrideMessage.trim()
      : inputValue.trim();
    if (!message) return;

    setShowAnalysis(false);
    setAnalysisData(null);

    setTimeout(() => {
      const detected: DangerousCommand[] = [];
      let maxSeverity: "critical" | "warning" | null = null;

      DANGEROUS_COMMANDS.forEach((cmd) => {
        const regex = new RegExp(
          cmd.pattern
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .replace(/\\\*/g, ".*"),
          "i",
        );
        if (regex.test(message.toLowerCase())) {
          detected.push(cmd);
          if (
            !maxSeverity ||
            (cmd.level === "critical" && maxSeverity !== "critical")
          ) {
            maxSeverity = cmd.level;
          }
        }
      });

      const commandIsCritical = maxSeverity === "critical";
      const analysis = getAnalysis(message);

      setDetectedCommands(detected);
      setIsCritical(commandIsCritical);
      setAnalysisData({ ...analysis, command: message });

      if (commandIsCritical) {
        // CRITICAL: safety warning dulu, analysis belum muncul
        setIsSafetyWarning(true);
        setShowAnalysis(false);
      } else {
        // WARNING atau safe: langsung analysis panel
        setIsSafetyWarning(false);
        setShowAnalysis(true);
      }
    }, 0);
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    checkDangerousCommands(val);
    if (showAnalysis && val !== analysisData?.command) {
      setShowAnalysis(false);
      setAnalysisData(null);
    }
  };

  const executeCommand = () => {
    if (!analysisData) return;

    // ── FIX: simpan state SEBELUM di-reset ──
    // detectedCommands akan jadi [] setelah reset,
    // jadi harus disimpan dulu sebelum setState
    const wasDangerous =
      detectedCommands.length > 0 || analysisData.riskColor === "red";
    const wasIsCritical = isCritical;
    const currentPendingResponse = pendingResponse;

    const newMessage: Message = {
      id: generateId(),
      type: "user",
      content: analysisData.command,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setShowAnalysis(false);
    setAnalysisData(null);
    setIsSafetyWarning(false);
    setIsCritical(false);
    setDetectedCommands([]);
    setIsTyping(true);
    setPendingResponse(null);

    setTimeout(() => {
      const aiMessage: Message = {
        id: generateId(),
        // Pakai wasDangerous bukan detectedCommands.length (sudah [])
        type: currentPendingResponse
          ? currentPendingResponse.type
          : wasDangerous
            ? "dangerous"
            : "ai",
        content: currentPendingResponse
          ? currentPendingResponse.content
          : wasDangerous
            ? "Perintah ini mengandung risiko yang lebih tinggi dan akan dieksekusi dengan batasan privilege untuk menjaga keamanan sistem."
            : "Perintah ini telah dianalisis dan tampak aman untuk dijalankan. Berikut ringkasan yang akan dilakukan:<br/><br/>• Mengeksekusi perintah pada host target<br/>• Mengembalikan output langsung ke dalam chat untuk tinjauan<br/>• Tidak melakukan perubahan tambahan di luar perintah yang diminta",
        time: formatTime(),
        // Pakai wasIsCritical bukan isCritical (sudah false)
        severity:
          currentPendingResponse?.severity ??
          (wasIsCritical ? "critical" : "warning"),
        codeSnippet: currentPendingResponse?.codeSnippet,
        language: currentPendingResponse?.language,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 3000);
  };

  const cancelCommand = () => {
    setShowAnalysis(false);
    setAnalysisData(null);
    setIsSafetyWarning(false);
    setIsCritical(false);
    setDetectedCommands([]);
    setInputValue("");
  };

  const copyCodeSnippet = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
  };

  const runCodeSnippet = (code: string) => {
    setInputValue(code);
    checkDangerousCommands(code);
    handleSend(code);
  };

  const retryMessage = (message: string) => {
    setInputValue(message);
    checkDangerousCommands(message);
    setShowAnalysis(false);
  };

  const giveFeedback = (id: string, feedback: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? { ...msg, content: `${msg.content}\n\n[Feedback: ${feedback}]` }
          : msg,
      ),
    );
  };

  const applySuggestion = (suggestion: ChatSuggestion) => {
    setDetectedCommands([]);
    setIsSafetyWarning(false);
    setIsCritical(suggestion.response.severity === "critical");
    setPendingResponse(suggestion.response);

    if (suggestion.response.analysis) {
      setAnalysisData({
        command: suggestion.command,
        impacts: suggestion.response.analysis.impacts,
        duration: suggestion.response.analysis.duration,
        space: suggestion.response.analysis.space,
        risk: suggestion.response.analysis.risk,
        riskColor: suggestion.response.analysis.riskColor,
      });
      setShowAnalysis(true);
    } else {
      setAnalysisData(null);
      setShowAnalysis(false);
    }

    setInputValue("");
  };

  return (
    <section
      aria-label="Chat interface"
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      {/* ── Messages ── */}
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-[15%] lg:px-[20%]">
        {messages.map((msg) => (
          <article
            key={msg.id}
            aria-label={
              msg.type === "user"
                ? "Pesan pengguna"
                : msg.type === "dangerous"
                  ? "Peringatan keamanan"
                  : "Pesan agen"
            }
            className={cn(
              "my-6 flex animate-slide-up flex-col",
              msg.type === "user" ? "items-end" : "items-start",
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "mb-2 flex items-center gap-2.5",
                msg.type === "user" ? "flex-row-reverse" : "",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm",
                  msg.type === "user" && "bg-accent-amber text-bg-primary",
                  msg.type === "ai" && "bg-accent-cyan text-bg-primary",
                  msg.type === "dangerous" && "bg-accent-red text-white",
                )}
              >
                {msg.type === "user" ? (
                  <User className="h-4 w-4" />
                ) : msg.type === "dangerous" ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <span className="text-sm font-semibold">
                {msg.type === "user"
                  ? "Anda"
                  : msg.type === "dangerous"
                    ? "Safety Guard"
                    : "Orion Agent"}
              </span>
              <span className="text-xs text-text-muted">{msg.time}</span>
            </div>

            {/* Bubble */}
            <div
              className={cn(
                "max-w-[90%] rounded-xl p-4 text-sm leading-relaxed",
                msg.type === "user" &&
                  "border border-accent-amber/15 bg-accent-amber/10 text-right",
                msg.type === "ai" &&
                  "border border-border-custom bg-surface text-left",
                msg.type === "dangerous" &&
                  "border border-accent-red/25 bg-accent-red/5 text-left",
              )}
            >
              {msg.type === "dangerous" ? (
                <div className="rounded-xl p-3.5">
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-red/15 text-accent-red">
                      {msg.severity === "critical" ? (
                        <Skull className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-[15px] font-bold text-accent-red">
                      {msg.severity === "critical"
                        ? "EKSEKUSI DIBLOKIR"
                        : "PERINGATAN KEAMANAN"}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "mb-2.5 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                      msg.severity === "critical"
                        ? "border border-red-500/30 bg-red-500/15 text-red-500"
                        : "border border-accent-amber/30 bg-accent-amber/15 text-accent-amber",
                    )}
                  >
                    {msg.severity === "critical" ? (
                      <Skull className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {msg.severity?.toUpperCase()}
                  </span>
                  <p className="mb-2.5 text-[13px] leading-relaxed text-text-secondary">
                    {msg.severity === "critical"
                      ? "Perintah ini memiliki risiko CRITICAL yang dapat menyebabkan kerusakan permanen atau downtime total."
                      : "Perintah yang Anda kirim mengandung instruksi berpotensi berbahaya. Dieksekusi dengan privilege terbatas."}
                  </p>
                  <div className="rounded-r-lg border-l-[3px] border-accent-cyan bg-accent-cyan/5 p-2.5 text-xs text-text-secondary">
                    <Info className="mr-1 inline h-3 w-3 text-accent-cyan" />
                    <strong>Rekomendasi:</strong>{" "}
                    {msg.severity === "critical"
                      ? "Jangan eksekusi tanpa supervisi senior dan change approval."
                      : "Verifikasi output sebelum menerapkan perubahan. Gunakan --dry-run untuk simulasi."}
                  </div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              )}

              {msg.codeSnippet && (
                <div className="code-bg my-4 overflow-hidden rounded-2xl border border-border-custom">
                  <div className="code-header flex items-center justify-between border-b border-border-custom px-4 py-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-cyan">
                      {msg.language}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => runCodeSnippet(msg.codeSnippet!)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-accent-cyan px-3 py-1.5 text-[11px] font-semibold text-bg-primary transition-all hover:opacity-90"
                      >
                        <Play className="h-3 w-3" /> Run
                      </button>
                      <button
                        onClick={() => copyCodeSnippet(msg.codeSnippet!)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border-custom bg-surface px-3 py-1.5 text-[11px] text-text-secondary transition-all hover:bg-surface-hover"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    </div>
                  </div>
                  <pre className="scrollbar-thin code-body overflow-x-auto whitespace-pre-wrap px-4 py-4 font-mono text-[13px] text-text-secondary">
                    {msg.codeSnippet}
                  </pre>
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className={cn(
                "mt-2 flex flex-wrap gap-2",
                msg.type === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.type === "dangerous" ? (
                <>
                  <button className="flex items-center gap-2 rounded-lg bg-accent-cyan px-3.5 py-2 text-xs font-semibold text-bg-primary transition-all hover:opacity-90">
                    <Play className="h-3.5 w-3.5" /> Jalankan dengan Dry-Run
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-accent-red/30 px-3.5 py-2 text-xs font-semibold text-accent-red transition-all hover:bg-accent-red/20">
                    <Ban className="h-3.5 w-3.5" /> Batalkan Operasi
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    className="flex items-center gap-2 rounded-lg border border-border-custom bg-surface px-3.5 py-2 text-xs text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
                  >
                    <Copy className="h-3.5 w-3.5" /> Salin
                  </button>
                  <button
                    onClick={() => retryMessage(msg.content)}
                    className="flex items-center gap-2 rounded-lg border border-border-custom bg-surface px-3.5 py-2 text-xs text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Ulangi
                  </button>
                  <button
                    onClick={() => giveFeedback(msg.id, "up")}
                    className="flex items-center gap-2 rounded-lg border border-border-custom bg-surface px-3.5 py-2 text-xs text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => giveFeedback(msg.id, "down")}
                    className="flex items-center gap-2 rounded-lg border border-border-custom bg-surface px-3.5 py-2 text-xs text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </article>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="my-6 flex animate-slide-up flex-col items-start">
            <div className="mb-2 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-cyan/10 text-accent-cyan">
                <Bot className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Orion Agent</span>
            </div>
            <div className="rounded-xl border border-border-custom bg-surface p-4">
              <div className="flex h-6 items-end gap-2">
                <span
                  className="animate-dot-wave h-2 w-2 rounded-full bg-accent-cyan"
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className="animate-dot-wave h-2 w-2 rounded-full bg-accent-cyan"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="animate-dot-wave h-2 w-2 rounded-full bg-accent-cyan"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 space-y-3 border-t border-border-custom px-4 py-4 md:px-[15%] lg:px-[20%]">
        {isSafetyWarning && (
          <SafetyWarning
            isCritical={isCritical}
            detectedCommands={detectedCommands}
            onCancel={cancelCommand}
            onContinue={() => {
              setIsSafetyWarning(false);
              setShowAnalysis(true);
              handleSend();
            }}
          />
        )}

        {showAnalysis && analysisData && (
          <AnalysisPanel
            analysisData={analysisData}
            detectedCommands={detectedCommands}
            isCritical={isCritical}
            onCancel={cancelCommand}
            onConfirm={executeCommand}
          />
        )}

        <CommandInput
          value={inputValue}
          onChange={handleInputChange}
          onSubmit={handleSend}
          isSafetyWarning={isSafetyWarning}
          isCritical={isCritical}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary">
            Quick prompt
          </span>
          <span className="text-xs text-text-muted">Klik untuk isi cepat</span>
        </div>
        <div className="flex flex-wrap gap-2 pb-1">
          {CHAT_SUGGESTIONS.map((suggestion) => {
            const Icon =
              suggestion.icon === "maximize"
                ? Maximize2
                : suggestion.icon === "refresh"
                  ? RefreshCcw
                  : suggestion.icon === "database"
                    ? Database
                    : Gauge;
            return (
              <button
                key={suggestion.id}
                onClick={() => applySuggestion(suggestion)}
                className="flex items-center gap-1.5 rounded-full border border-border-custom bg-surface px-3.5 py-2 text-xs text-text-secondary transition-all hover:border-accent-cyan hover:bg-surface-hover hover:text-text-primary"
              >
                <Icon className="h-3.5 w-3.5" />
                {suggestion.text}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
