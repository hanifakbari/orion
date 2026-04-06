"use client";

import { useRef, useEffect } from "react";
import { Paperclip, Mic, ArrowUp } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isSafetyWarning?: boolean;
  isCritical?: boolean;
  placeholder?: string;
}

export const CommandInput = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isSafetyWarning = false,
  isCritical = false,
  placeholder = "Ketik perintah infrastruktur atau tanya sistem...",
}: CommandInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = newHeight + "px";
      textarea.style.overflowY =
        textarea.scrollHeight > 200 ? "auto" : "hidden";
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const canSend = value.trim() && !isSafetyWarning && !disabled;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border-custom bg-surface p-1 transition-all duration-300",
        "focus-within:border-accent-cyan",
        isSafetyWarning && !isCritical && "border-accent-red",
        isCritical && "border-red-500",
      )}
    >
      <div className="flex items-end gap-2.5 p-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="scrollbar-thin max-h-[200px] min-h-[24px] flex-1 resize-none overflow-y-auto border-none bg-transparent font-sans text-[15px] leading-relaxed text-text-primary outline-none placeholder:text-text-muted disabled:opacity-50"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSafetyWarning || disabled}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-custom bg-surface text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={isSafetyWarning || disabled}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-custom bg-surface text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSend}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl font-semibold transition-all",
              canSend
                ? "bg-accent-cyan text-bg-primary hover:scale-105 hover:bg-[#33e0ff]"
                : "cursor-not-allowed bg-text-muted text-bg-primary opacity-40",
            )}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
