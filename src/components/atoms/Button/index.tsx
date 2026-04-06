import { cn } from "@/app/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          {
            // Variants
            "border border-border-custom bg-surface text-text-secondary hover:bg-surface-hover":
              variant === "default" || variant === "outline",
            "shadow-accent-green-glow bg-accent-green text-bg-primary shadow-lg hover:bg-[#33ffaa]":
              variant === "primary",
            "border border-accent-red/30 bg-accent-red/10 text-accent-red hover:bg-accent-red/20":
              variant === "danger",
            "bg-transparent text-text-secondary hover:bg-surface-hover":
              variant === "ghost",
            // Sizes
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-5 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
            "h-9 w-9 p-0": size === "icon",
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
