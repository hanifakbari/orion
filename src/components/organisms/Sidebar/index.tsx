"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Plus, Bookmark, Folder, Clock } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useMetrics } from "@/hooks/useMatrics";
import {
  PINNED_CHATS,
  PROJECTS,
  TODAY_CHATS,
  WEEK_CHATS,
} from "@/app/lib/constants";
import {
  ChatItem,
  NavSectionHeader,
  ProfileButton,
  SidebarStats,
} from "@/components";
import { Assets } from "@/assets";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [activeChat, setActiveChat] = useState("3");
  const { ram, cpu, uptime } = useMetrics();

  return (
    <aside
      className={cn(
        "glass z-50 flex shrink-0 flex-col overflow-hidden border-r border-border-custom bg-bg-secondary transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isOpen
          ? "pointer-events-auto fixed inset-y-0 left-0 w-[80vw] max-w-xs translate-x-0 opacity-100 md:static md:h-auto md:w-[300px]"
          : "pointer-events-none fixed inset-y-0 left-0 w-[80vw] max-w-xs -translate-x-full opacity-0 md:static md:w-0 md:translate-x-0 md:opacity-0",
      )}
      aria-label="Sidebar"
    >
      {/* Logo */}
      <header className="shrink-0 px-4 py-4">
        <div className="flex items-center gap-2">
          <Image
            src={Assets.Orion}
            alt="Orion Logo"
            width={24}
            height={24}
            className="h-14 w-14"
          />
          <span className="font-mono text-lg font-bold tracking-widest text-text-primary lg:text-2xl">
            Orion
          </span>
        </div>
      </header>

      {/* Stats  */}
      <SidebarStats ram={ram} cpu={cpu} uptime={uptime} />

      {/* Search + New Chat  */}
      <section
        aria-label="Cari percakapan"
        className="shrink-0 space-y-3 px-3.5 py-3"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border-custom bg-surface-hover px-3.5 py-2 transition-all focus-within:border-accent-cyan">
          <Search className="h-3 w-3 text-text-muted" />
          <input
            type="search"
            placeholder="Cari percakapan..."
            aria-label="Cari percakapan"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-muted"
          />
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 px-3.5 py-2 text-[13px] font-semibold text-accent-cyan transition-all hover:bg-accent-cyan hover:text-bg-primary"
        >
          <Plus className="h-4 w-4" />
          Chat Baru
        </button>
      </section>

      {/* Navigation */}
      <nav
        aria-label="Sidebar navigation"
        className="scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto px-2 pb-2"
      >
        {/* Pinned */}
        <div>
          <NavSectionHeader
            icon={Bookmark}
            label="Pinned"
            isOpen={pinnedOpen}
            onToggle={() => setPinnedOpen((p) => !p)}
          />
          {pinnedOpen && (
            <ul className="space-y-1">
              {PINNED_CHATS.map((chat) => (
                <li key={chat.id}>
                  <ChatItem
                    id={chat.id}
                    title={chat.title}
                    meta={chat.meta}
                    isActive={activeChat === chat.id}
                    onClick={setActiveChat}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Projects */}
        <div>
          <NavSectionHeader
            icon={Folder}
            label="Projects"
            isOpen={projectsOpen}
            onToggle={() => setProjectsOpen((p) => !p)}
          />
          {projectsOpen && (
            <ul className="space-y-1">
              {PROJECTS.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-3 text-left transition-all hover:border-border-custom hover:bg-surface-hover"
                  >
                    <span className="text-[13px] font-medium text-text-primary">
                      {project.name}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {project.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* History */}
        <div>
          <NavSectionHeader
            icon={Clock}
            label="History Chat"
            isOpen={historyOpen}
            onToggle={() => setHistoryOpen((p) => !p)}
          />
          {historyOpen && (
            <div className="space-y-3">
              <section aria-labelledby="history-today-heading">
                <h3
                  id="history-today-heading"
                  className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary"
                >
                  Hari Ini
                </h3>
                <ul className="space-y-1">
                  {TODAY_CHATS.map((chat) => (
                    <li key={chat.id}>
                      <ChatItem
                        id={chat.id}
                        title={chat.title}
                        meta={chat.meta}
                        isActive={activeChat === chat.id}
                        onClick={setActiveChat}
                      />
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="history-week-heading">
                <h3
                  id="history-week-heading"
                  className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary"
                >
                  Minggu Ini
                </h3>
                <ul className="space-y-1">
                  {WEEK_CHATS.map((chat) => (
                    <li key={chat.id}>
                      <ChatItem
                        id={chat.id}
                        title={chat.title}
                        meta={chat.meta}
                        isActive={activeChat === chat.id}
                        onClick={setActiveChat}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>
      </nav>

      {/* Profile  */}
      <ProfileButton
        name="John Doe"
        role="Senior DevOps Engineer"
        initials="JD"
      />
    </aside>
  );
};
