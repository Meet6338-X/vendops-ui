import { cn } from "@/lib/utils";

export function DialectBadge({
  language,
  className,
}: {
  language: string | null | undefined;
  className?: string;
}) {
  const code = (language || "en").toLowerCase();

  const configs: Record<string, { label: string; bg: string; text: string; border: string }> = {
    "hi-latn": {
      label: "Hinglish (Roman)",
      bg: "bg-purple-950/40",
      text: "text-purple-300",
      border: "border-purple-600/40",
    },
    hi: {
      label: "Hindi (Devanagari)",
      bg: "bg-amber-950/40",
      text: "text-amber-300",
      border: "border-amber-600/40",
    },
    mixed: {
      label: "Mixed Dialect",
      bg: "bg-cyan-950/40",
      text: "text-cyan-300",
      border: "border-cyan-600/40",
    },
    en: {
      label: "English (Formal)",
      bg: "bg-blue-950/40",
      text: "text-blue-300",
      border: "border-blue-600/40",
    },
  };

  const current = configs[code] || configs["en"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border",
        current.bg,
        current.text,
        current.border,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {current.label}
    </span>
  );
}
