"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type UserRole = "Ops" | "Maint";

export function RoleSwitcher({
  onChange,
}: {
  onChange?: (role: UserRole) => void;
}) {
  const [activeRole, setActiveRole] = useState<UserRole>("Ops");

  const handleSwitch = (role: UserRole) => {
    setActiveRole(role);
    onChange?.(role);
  };

  return (
    <div className="flex items-center p-1 bg-[#18181B] border border-zinc-800 rounded-full scale-90 sm:scale-100">
      <button
        type="button"
        onClick={() => handleSwitch("Ops")}
        className={cn(
          "px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-200",
          activeRole === "Ops"
            ? "bg-[#2563eb] text-white shadow-sm"
            : "text-[#71717a] hover:text-white"
        )}
      >
        AP Ops
      </button>
      <button
        type="button"
        onClick={() => handleSwitch("Maint")}
        className={cn(
          "px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-200",
          activeRole === "Maint"
            ? "bg-[#2563eb] text-white shadow-sm"
            : "text-[#71717a] hover:text-white"
        )}
      >
        Maint
      </button>
    </div>
  );
}
