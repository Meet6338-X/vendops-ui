"use client";

import { Bell, Search, Radio, Menu } from "lucide-react";
import { RoleSwitcher } from "../shared/role-switcher";
import { ThemeToggle } from "../shared/theme-toggle";

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
  isBackendConnected?: boolean;
}

export function Header({
  onToggleMobileSidebar,
  isBackendConnected = true,
}: HeaderProps) {
  return (
    <header className="h-16 bg-[#18181B]/80 backdrop-blur-md border-b border-zinc-800/80 px-6 flex items-center justify-between z-20">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search Input (384px wide, #18181B bg) */}
        <div className="relative hidden sm:block w-72 md:w-96">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice INV-..., PO-..., or vendor ID..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#18181B] border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Role Switcher */}
        <RoleSwitcher />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Live Stream Connectivity Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-mono text-xs text-emerald-400 font-medium">
            {isBackendConnected ? "LIVE TELEMETRY (ONLINE)" : "BACKEND CONNECTING..."}
          </span>
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <ThemeToggle />

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-lg bg-[#18181B] border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-unit-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        </button>
      </div>
    </header>
  );
}
