"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  ShieldCheck,
  FileSpreadsheet,
  Database,
  BarChart3,
  ShieldAlert,
  Bot,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeVariant?: "red" | "orange" | "blue";
}

export function Sidebar({ pendingApprovalsCount = 0 }: { pendingApprovalsCount?: number }) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title: "Overview",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "New Dispute",
      href: "/disputes/new",
      icon: FilePlus2,
    },
    {
      title: "Approvals (HITL)",
      href: "/approvals",
      icon: ShieldCheck,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeVariant: "orange",
    },
    {
      title: "Audit Ledger",
      href: "/audit",
      icon: FileSpreadsheet,
    },
    {
      title: "ERP Explorer",
      href: "/erp",
      icon: Database,
    },
    {
      title: "Quality Evals",
      href: "/quality",
      icon: BarChart3,
    },
    {
      title: "Guard Inspector",
      href: "/guard",
      icon: ShieldAlert,
    },
  ];

  return (
    <aside className="w-[280px] flex-shrink-0 min-h-screen bg-[#18181B] border-r border-zinc-800/80 flex flex-col justify-between p-4 select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-zinc-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">Vend</span>
              <span className="font-bold text-lg tracking-tight text-blue-500">Ops</span>
            </div>
            <p className="text-[10px] tracking-wider uppercase text-zinc-500 font-mono">Agentic Harness</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-blue-600/10 text-white border border-blue-500/30 shadow-[0_0_16px_-4px_rgba(59,130,246,0.3)]"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                  <span>{item.title}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-mono font-bold rounded-full border",
                      item.badgeVariant === "orange"
                        ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="pt-4 border-t border-zinc-800/60 space-y-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-zinc-400 font-medium">Orchestration</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-unit-pulse" />
              LangGraph
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-500 text-[11px] font-mono">
            <span>MCP Server</span>
            <span className="text-zinc-300">Port 8001 (Active)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-mono font-bold">
            AP
          </div>
          <div className="text-xs">
            <p className="font-medium text-zinc-200">AP Controller</p>
            <p className="text-[10px] text-zinc-500 font-mono">ap.controller@enterprise.internal</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
