import { ChevronUp, LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface NavSectionHeaderProps {
  icon: LucideIcon;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const NavSectionHeader = ({
  icon: Icon,
  label,
  isOpen,
  onToggle,
}: NavSectionHeaderProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-text-muted transition-all hover:bg-surface-hover"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-accent-cyan" />
        {label}
      </span>
      <ChevronUp
        className={cn(
          "h-3 w-3 transition-transform duration-200",
          isOpen ? "rotate-0" : "-rotate-90",
        )}
      />
    </button>
  );
};
