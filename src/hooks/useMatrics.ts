"use client";

import { formatUptime } from "@/app/lib/utils";
import { useState, useEffect } from "react";

interface Metrics {
  ram: number;
  cpu: number;
  disk: number;
  uptime: string;
  uptimeSeconds: number;
}

export function useMetrics(): Metrics {
  const [ram, setRam] = useState(45);
  const [cpu, setCpu] = useState(23);
  const [disk, setDisk] = useState(67);
  const [uptimeSeconds, setUptimeSeconds] = useState(3 * 86400 + 4 * 3600);

  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setRam(Math.floor(45 + Math.random() * 40));
      setCpu(Math.floor(10 + Math.random() * 50));
      setDisk((prev) => (Math.random() > 0.7 ? Math.min(100, prev + 1) : prev));
    }, 3000);

    const uptimeInterval = setInterval(() => {
      setUptimeSeconds((prev) => prev + 60);
    }, 60000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(uptimeInterval);
    };
  }, []);

  return {
    ram,
    cpu,
    disk,
    uptime: formatUptime(uptimeSeconds),
    uptimeSeconds,
  };
}
