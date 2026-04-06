// src/components/molecules/ProfileButton/index.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  ChevronUp,
  User,
  Settings,
  Bell,
  Moon,
  Sun,
  Keyboard,
  LogOut,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ProfileButtonProps {
  name: string;
  role: string;
  initials: string;
}

const STATIC_MENU_ITEMS = [
  { icon: User, label: "Profil Saya", badge: undefined },
  { icon: Settings, label: "Pengaturan", badge: undefined },
  { icon: Bell, label: "Notifikasi", badge: "3" },
  { icon: Keyboard, label: "Shortcut Keyboard", badge: undefined },
];

export const ProfileButton = ({ name, role, initials }: ProfileButtonProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Wajib tunggu mount agar tidak hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <div className="relative shrink-0 border-t border-border-custom p-2.5">
      {/* ── Popup ── */}
      <div
        className={cn(
          "popup-panel absolute bottom-full left-2.5 right-2.5 z-50 mb-2 overflow-hidden rounded-xl border border-border-custom transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border-custom p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-cyan text-base font-bold text-bg-primary">
            {initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">
              {name}
            </div>
            <div className="text-xs text-text-muted">{role}</div>
          </div>
        </div>

        {/* Menu */}
        <div className="p-2">
          {/* Static items */}
          {STATIC_MENU_ITEMS.map((item, idx) => (
            <button
              key={idx}
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
            >
              <item.icon className="h-4 w-4 text-text-muted transition-colors group-hover:text-accent-cyan" />
              {item.label}
              {item.badge && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {/* Theme toggle — render penuh hanya setelah mounted */}
          <button
            onClick={() => mounted && setTheme(isDark ? "light" : "dark")}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
          >
            {mounted ? (
              isDark ? (
                <Sun className="h-4 w-4 text-text-muted transition-colors group-hover:text-accent-cyan" />
              ) : (
                <Moon className="h-4 w-4 text-text-muted transition-colors group-hover:text-accent-cyan" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}

            {/* Label */}
            <span>
              {mounted ? (isDark ? "Light Mode" : "Dark Mode") : "Mode"}
            </span>

            {/* Toggle pill — setelah mounted */}
            {mounted && (
              <div className="ml-auto">
                <div
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors duration-300",
                    isDark ? "bg-accent-cyan" : "bg-text-muted/30",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                      isDark ? "translate-x-4" : "translate-x-0.5",
                    )}
                  />
                </div>
              </div>
            )}
          </button>

          <div className="mx-2 my-2 h-px bg-border-custom" />

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-accent-red transition-all hover:bg-accent-red/10">
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>

      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
          open ? "bg-surface-active" : "hover:bg-surface-hover",
        )}
      >
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-cyan text-sm font-bold text-bg-primary">
          {initials}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg-secondary bg-accent-green" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <h4 className="text-[13px] font-semibold text-text-primary">
            {name}
          </h4>
          <p className="truncate text-[11px] text-text-muted">{role}</p>
        </div>
        <ChevronUp
          className={cn(
            "h-4 w-4 text-text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
    </div>
  );
};
