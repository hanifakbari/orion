// src/types/index.ts

// ─────────────────────────────────────
// DATA TYPES — murni data, tidak ada UI
// ─────────────────────────────────────

export interface ChatHistoryItem {
  id: string;
  title: string;
  meta: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface Message {
  id: string;
  type: "user" | "ai" | "dangerous";
  content: string;
  time: string;
  severity?: "critical" | "warning";
  codeSnippet?: string;
  language?: string;
}

export interface AnalysisData {
  command: string;
  impacts: string[];
  duration: string;
  space: string;
  risk: string;
  riskColor: "green" | "amber" | "red";
}

export interface DangerousCommand {
  pattern: string;
  level: "critical" | "warning";
  desc: string;
}

export interface Metrics {
  ram: number;
  cpu: number;
  uptime: string;
}

// ─────────────────────────────────────
// PROMPT & SUGGESTION TYPES
// ─────────────────────────────────────

export interface QuickPromptResponse {
  type: "ai" | "dangerous";
  content: string;
  codeSnippet?: string;
  language?: string;
  severity?: "critical" | "warning";
  analysis?: {
    risk: string;
    riskColor: "green" | "amber" | "red";
    impacts: string[];
    duration: string;
    space: string;
  };
}

export interface QuickPrompt {
  id: number;
  title: string;
  description: string;
  prompt: string;
  type: string;
  response: QuickPromptResponse;
}

export interface ChatSuggestion {
  id: number;
  text: string;
  command: string;
  icon: "maximize" | "refresh" | "database" | "gauge";
  response: QuickPromptResponse;
}

// ─────────────────────────────────────
// CONSTANTS TYPES — untuk ANALYSIS_DATABASE
// ─────────────────────────────────────

export interface CommandAnalysis {
  patterns: string[];
  impacts: string[];
  duration: string;
  space: string;
  risk: string;
  riskColor: "green" | "amber" | "red";
}
