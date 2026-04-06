// src/app/page.tsx atau layout.tsx
"use client";

import { useState } from "react";
import { MainContent, Sidebar } from "@/components";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative flex h-screen overflow-hidden" role="application">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={toggleSidebar}
          aria-label="Tutup sidebar"
        />
      )}
      <MainContent sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
    </div>
  );
}
