"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldAlert, Lock } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";

interface HitlAlertBannerProps {
  reason?: string;
  amount?: number;
  threadId: string;
}

export function HitlAlertBanner({
  reason = "High-value financial threshold reached ($100,000.00) or low policy confidence.",
  amount,
  threadId,
}: HitlAlertBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-orange-500/60 bg-gradient-to-r from-orange-950/60 via-zinc-900/90 to-orange-950/40 p-4 sm:p-5 shadow-[0_0_30px_rgba(249,115,22,0.2)] animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-orange-600/20 border border-orange-500/50 text-orange-400 flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-orange-200 uppercase tracking-wider font-mono">
                Pipeline Interrupted: HITL Review Gate Activated
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950 text-orange-300 border border-orange-600">
                AWAITING HUMAN SIGNOFF
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans max-w-2xl">
              {reason}
              {amount != null && (
                <span className="font-mono font-bold text-orange-300 ml-1">
                  (${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })})
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/approvals"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/30 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <span>Review in /approvals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
