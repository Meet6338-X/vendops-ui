import React from "react";
import { cn } from "@/lib/utils";
import { ActionType } from "@/lib/schemas/dispute";
import {
  CheckCircle2,
  DollarSign,
  FileCheck,
  RefreshCw,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface ActionBadgeProps {
  action: ActionType | string | null | undefined;
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const ACTION_CONFIG: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  RELEASE_PAYMENT: {
    label: "Release Payment",
    bg: "bg-emerald-950/50",
    text: "text-emerald-300",
    border: "border-emerald-600/40",
    icon: CheckCircle2,
  },
  PARTIAL_PAYMENT: {
    label: "Partial Payment",
    bg: "bg-blue-950/50",
    text: "text-blue-300",
    border: "border-blue-600/40",
    icon: DollarSign,
  },
  CREDIT_NOTE: {
    label: "Credit Note",
    bg: "bg-amber-950/50",
    text: "text-amber-300",
    border: "border-amber-600/40",
    icon: FileCheck,
  },
  REPLACEMENT: {
    label: "Replacement",
    bg: "bg-cyan-950/50",
    text: "text-cyan-300",
    border: "border-cyan-600/40",
    icon: RefreshCw,
  },
  REJECT: {
    label: "Reject Claim",
    bg: "bg-red-950/50",
    text: "text-red-300",
    border: "border-red-600/40",
    icon: XCircle,
  },
  ESCALATE: {
    label: "Escalate to Legal",
    bg: "bg-purple-950/50",
    text: "text-purple-300",
    border: "border-purple-600/40",
    icon: AlertTriangle,
  },
};

export function ActionBadge({
  action,
  className,
  size = "md",
  showIcon = true,
}: ActionBadgeProps) {
  const key = action ? action.toUpperCase() : "UNKNOWN";
  const config = ACTION_CONFIG[key] || {
    label: action || "Unknown",
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    border: "border-zinc-700/50",
    icon: FileCheck,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium rounded-full border transition-colors",
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />}
      <span>{config.label}</span>
    </span>
  );
}
