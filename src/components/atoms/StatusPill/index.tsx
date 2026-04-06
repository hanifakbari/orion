// src/components/atoms/StatusPill.tsx
import { LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface StatusPillProps {
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  value?: string | number;
  className?: string;
}

export const StatusPill = ({
  icon: Icon,
  iconColor = "text-text-muted",
  label,
  value,
  className,
}: StatusPillProps) => {
  return (
    <div
      className={cn(
        "pill flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <Icon className={cn("h-3 w-3 shrink-0", iconColor)} />
      <span className="font-medium text-text-primary">
        {label}{" "}
        {value !== undefined && (
          <strong className="text-text-primary">{value}</strong>
        )}
      </span>
    </div>
  );
};
