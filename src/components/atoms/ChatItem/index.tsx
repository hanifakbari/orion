import { cn } from "@/app/lib/utils";

interface ChatItemProps {
  id: string;
  title: string;
  meta: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export const ChatItem = ({
  id,
  title,
  meta,
  isActive,
  onClick,
}: ChatItemProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={cn(
        "group flex w-full flex-col gap-1 rounded-xl px-3 py-3 text-left transition-all duration-200",
        isActive
          ? "border border-accent-cyan/20 bg-accent-cyan/10"
          : "border border-transparent hover:bg-surface-hover",
      )}
    >
      <div className="truncate text-[13px] font-medium text-text-primary">
        {title}
      </div>
      <div className="text-[11px] text-text-muted">{meta}</div>
    </button>
  );
};
