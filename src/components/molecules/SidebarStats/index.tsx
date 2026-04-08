import { StatusPill } from "@/components";
import { Dot, MemoryStick, Clock, Cpu } from "lucide-react";

interface SidebarStatsProps {
  ram: number | string;
  cpu: number | string;
  uptime: string;
}

export const SidebarStats = ({ ram, cpu, uptime }: SidebarStatsProps) => {
  return (
    <section
      aria-labelledby="sidebar-status-heading"
      className="flex shrink-0 flex-wrap items-center gap-2 px-3.5 py-3"
    >
      <h2 id="sidebar-status-heading" className="sr-only">
        Status Sistem
      </h2>

      <StatusPill icon={Dot} iconColor="text-accent-green" label="Online" />
      <StatusPill icon={MemoryStick} label="RAM" value={`${ram}%`} />
      <StatusPill icon={Clock} label="Uptime" value={uptime} />
      <StatusPill icon={Cpu} label="CPU" value={`${cpu}%`} />
    </section>
  );
};
