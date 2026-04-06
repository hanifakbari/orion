// src/components/molecules/TopBar.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Cpu,
  Clock,
  MemoryStick,
  CircleDot,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useMetrics } from "@/hooks/useMatrics";
import { cn } from "@/app/lib/utils";
import { StatusPill } from "@/components";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const TopBar = ({ sidebarOpen, onToggleSidebar }: TopBarProps) => {
  const { ram, cpu, uptime } = useMetrics();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <header
      className="absolute left-0 right-0 top-0 z-10 flex h-14 items-center gap-3 px-5"
      role="banner"
    >
      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-custom bg-surface text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Stats + Theme toggle */}
      <div
        className={cn(
          "ml-auto flex items-center gap-2 transition-all duration-300",
          !sidebarOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none hidden translate-x-2 opacity-0",
        )}
      >
        <button
          onClick={() => mounted && setTheme(isDark ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-all"
          aria-label="Toggle theme"
        >
          {mounted ? (
            isDark ? (
              <Sun className="h-6 w-6 text-accent-amber transition-colors" />
            ) : (
              <Moon className="h-6 w-6 text-accent-cyan transition-colors" />
            )
          ) : (
            <div className="h-6 w-6" />
          )}
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <StatusPill
            icon={CircleDot}
            iconColor="text-accent-green"
            label="Online"
          />
          <StatusPill icon={MemoryStick} label="RAM" value={`${ram}%`} />
          <StatusPill icon={Clock} label="Uptime" value={uptime} />
          <StatusPill icon={Cpu} label="CPU" value={`${cpu}%`} />
        </div>
      </div>
    </header>
  );
};
