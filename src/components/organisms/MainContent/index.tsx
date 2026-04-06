// src/components/MainContent.tsx
"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import type {
  Message,
  AnalysisData,
  QuickPrompt,
  QuickPromptResponse,
} from "@/app/types";
import { TopBar } from "@/components";
import { WelcomeScreen } from "../WelcomeScreen";
import { ChatInterface } from "../ChatInterface";

interface MainContentProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

function buildAnalysisMessage(analysisData: AnalysisData): Message {
  const isDangerous =
    analysisData.riskColor === "red" || analysisData.riskColor === "amber";
  const isCriticalRisk = analysisData.riskColor === "red";

  const riskColor =
    analysisData.riskColor === "red"
      ? "#ff4444"
      : analysisData.riskColor === "amber"
        ? "#ffaa00"
        : "#00ff88";

  return {
    id: `msg_${Date.now()}_analysis`,
    type: isDangerous ? "dangerous" : "ai",
    content: isDangerous
      ? `Perintah yang Anda kirim mengandung instruksi berpotensi berbahaya. Dieksekusi dengan privilege terbatas.<br/><br/>
• <strong>Command:</strong> <code>${analysisData.command}</code><br/>
• <strong>Risk Level:</strong> <span style="color: ${riskColor}">${analysisData.risk}</span><br/>
• <strong>Durasi:</strong> ${analysisData.duration}<br/><br/>
<strong>Impacts:</strong><br/>${analysisData.impacts.map((i) => `• ${i}`).join("<br/>")}`
      : `<strong>Analisis Eksekusi</strong><br/><br/>
• <strong>Command:</strong> <code>${analysisData.command}</code><br/>
• <strong>Risk Level:</strong> <span style="color: ${riskColor}">${analysisData.risk}</span><br/>
• <strong>Durasi:</strong> ${analysisData.duration}<br/>
• <strong>Space Impact:</strong> ${analysisData.space}<br/><br/>
<strong>Impacts:</strong><br/>${analysisData.impacts.map((i) => `• ${i}`).join("<br/>")}<br/><br/>
<strong>Siap dieksekusi.</strong>`,
    time: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    severity: isCriticalRisk ? "critical" : "warning",
  };
}

export const MainContent = ({
  sidebarOpen,
  onToggleSidebar,
}: MainContentProps) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [initialAnalysis, setInitialAnalysis] = useState<AnalysisData | null>(
    null,
  );
  const [initialPendingResponse, setInitialPendingResponse] =
    useState<QuickPromptResponse | null>(null);

  const handleStartChat = (message: string, analysisData?: AnalysisData) => {
    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      type: "user",
      content: message,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const messages: Message[] = [userMessage];

    if (analysisData) {
      messages.push(buildAnalysisMessage(analysisData));
    }

    setInitialMessages(messages);
    // null — user sudah confirm di WelcomeScreen, tidak perlu analysis panel lagi
    setInitialAnalysis(null);
    setInitialPendingResponse(null);
    setShowWelcome(false);
  };

  const handleQuickPrompt = (prompt: QuickPrompt) => {
    setInitialMessages([]);
    setInitialPendingResponse(prompt.response);

    // Quick prompt butuh analysis panel di ChatInterface
    if (prompt.response.analysis) {
      setInitialAnalysis({
        command: prompt.prompt,
        impacts: prompt.response.analysis.impacts,
        duration: prompt.response.analysis.duration,
        space: prompt.response.analysis.space,
        risk: prompt.response.analysis.risk,
        riskColor: prompt.response.analysis.riskColor,
      });
    } else {
      setInitialAnalysis(null);
    }

    setShowWelcome(false);
  };

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden transition-all duration-300">
      <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar} />

      <div
        className={cn(
          "flex min-h-0 w-full flex-1 flex-col pt-14",
          sidebarOpen
            ? "pointer-events-none select-none blur-sm md:pointer-events-auto md:blur-0"
            : "",
        )}
      >
        {showWelcome ? (
          <WelcomeScreen
            onStartChat={handleStartChat}
            onQuickPrompt={handleQuickPrompt}
          />
        ) : (
          <ChatInterface
            initialMessages={initialMessages}
            initialAnalysis={initialAnalysis}
            initialPendingResponse={initialPendingResponse}
          />
        )}
      </div>
    </main>
  );
};
