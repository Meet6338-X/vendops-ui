"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  Node,
  Edge,
  MarkerType,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  FileSearch,
  Minimize2,
  ListFilter,
  Scale,
  BookOpen,
  ShieldAlert,
  Cpu,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PipelineNodeStatus = "pending" | "active" | "completed" | "paused";

export interface PipelineNodeData {
  step: number;
  nodeKey: string;
  label: string;
  description: string;
  status: PipelineNodeStatus;
  iconName: string;
  selectedPanel?: string;
  onSelectNode?: (nodeKey: string) => void;
  [key: string]: unknown;
}

const NODE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ingest: FileSearch,
  compress: Minimize2,
  triage: ListFilter,
  verify: Scale,
  decide: BookOpen,
  hitl_gate: ShieldAlert,
  execute: Cpu,
  respond: MessageSquare,
};

function CustomPipelineNode({ data }: NodeProps<Node<PipelineNodeData>>) {
  const { step, nodeKey, label, description, status, onSelectNode } = data;
  const IconComponent = NODE_ICONS[nodeKey] || Play;

  const isPaused = status === "paused";
  const isActive = status === "active";
  const isCompleted = status === "completed";

  return (
    <div
      onClick={() => onSelectNode?.(nodeKey)}
      className={cn(
        "group relative w-64 rounded-xl border px-3.5 py-3 transition-all duration-300 cursor-pointer select-none backdrop-blur-md shadow-md",
        // Pending
        status === "pending" &&
          "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700",
        // Active (pulses blue)
        isActive &&
          "bg-blue-950/40 border-blue-500 shadow-[0_0_24px_rgba(59,130,246,0.35)] ring-2 ring-blue-500/50 animate-pulse text-zinc-100",
        // Paused HITL (pulses orange)
        isPaused &&
          "bg-orange-950/40 border-orange-500 shadow-[0_0_24px_rgba(249,115,22,0.4)] ring-2 ring-orange-500/60 animate-pulse text-zinc-100",
        // Completed (emerald checkmark)
        isCompleted &&
          "bg-[#18181B]/95 border-emerald-500/50 text-zinc-200 hover:border-emerald-400/80"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-zinc-600 !border-zinc-900 group-hover:!bg-blue-400"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
              status === "pending" && "bg-zinc-800 text-zinc-500",
              isActive && "bg-blue-600 text-white animate-bounce",
              isPaused && "bg-orange-600 text-white",
              isCompleted && "bg-emerald-950/80 text-emerald-400 border border-emerald-600/50"
            )}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-zinc-500">#{step}</span>
              <span className="text-xs font-semibold text-zinc-100">{label}</span>
            </div>
            <p className="text-[10px] text-zinc-400 line-clamp-1">{description}</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex-shrink-0 pt-0.5">
          {isActive && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-blue-900/60 text-blue-300 border border-blue-600/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              RUNNING
            </span>
          )}
          {isPaused && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-orange-950/80 text-orange-300 border border-orange-500/70">
              <AlertTriangle className="w-3 h-3 text-orange-400" />
              HITL
            </span>
          )}
          {isCompleted && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-600/40">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              DONE
            </span>
          )}
          {status === "pending" && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-500 bg-zinc-800/40 border border-zinc-800">
              <Clock className="w-2.5 h-2.5 text-zinc-600" />
              WAIT
            </span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-zinc-600 !border-zinc-900 group-hover:!bg-blue-400"
      />
    </div>
  );
}

const nodeTypes = {
  pipelineNode: CustomPipelineNode,
};

export const PIPELINE_NODES_CONFIG = [
  {
    key: "ingest",
    step: 1,
    label: "Ingest & Extract",
    description: "Multilingual dialect & ID provenance",
  },
  {
    key: "compress",
    step: 2,
    label: "Context Compress",
    description: "Fertility calc & noise reduction",
  },
  {
    key: "triage",
    step: 3,
    label: "Triage & Route",
    description: "Dispute category & priority scoring",
  },
  {
    key: "verify",
    step: 4,
    label: "3-Way ERP Match",
    description: "PO vs GRN vs Invoice reconciliation",
  },
  {
    key: "decide",
    step: 5,
    label: "SOP Policy RAG",
    description: "Resolution synthesis from vector SOPs",
  },
  {
    key: "hitl_gate",
    step: 6,
    label: "HITL Governance",
    description: "$100k threshold & policy circuit breaker",
  },
  {
    key: "execute",
    step: 7,
    label: "ERP Execution",
    description: "Ledger disbursement & credit note",
  },
  {
    key: "respond",
    step: 8,
    label: "Grounded Reply",
    description: "Dialect-matched vendor communication",
  },
];

interface PipelineGraphProps {
  currentRunningNode: string | null;
  executedNodes: string[];
  streamStatus: string;
  isInterrupted?: boolean;
  onSelectNode?: (nodeKey: string) => void;
}

export function PipelineGraph({
  currentRunningNode,
  executedNodes,
  streamStatus,
  isInterrupted = false,
  onSelectNode,
}: PipelineGraphProps) {
  const nodes: Node<PipelineNodeData>[] = useMemo(() => {
    return PIPELINE_NODES_CONFIG.map((config, index) => {
      let status: PipelineNodeStatus = "pending";

      const isNodePaused =
        config.key === "hitl_gate" &&
        (streamStatus === "paused_interrupt" || isInterrupted);

      if (isNodePaused) {
        status = "paused";
      } else if (currentRunningNode === config.key) {
        status = "active";
      } else if (executedNodes.includes(config.key)) {
        status = "completed";
      }

      return {
        id: config.key,
        type: "pipelineNode",
        position: { x: 40, y: index * 92 },
        data: {
          step: config.step,
          nodeKey: config.key,
          label: config.label,
          description: config.description,
          status,
          iconName: config.key,
          onSelectNode,
        },
      };
    });
  }, [currentRunningNode, executedNodes, streamStatus, isInterrupted, onSelectNode]);

  const edges: Edge[] = useMemo(() => {
    return PIPELINE_NODES_CONFIG.slice(0, -1).map((config, index) => {
      const nextConfig = PIPELINE_NODES_CONFIG[index + 1];
      const sourceDone = executedNodes.includes(config.key);
      const isTargetActive = currentRunningNode === nextConfig.key;

      return {
        id: `edge-${config.key}-${nextConfig.key}`,
        source: config.key,
        target: nextConfig.key,
        animated: isTargetActive,
        style: {
          stroke: sourceDone ? "#10b981" : isTargetActive ? "#3b82f6" : "#3f3f46",
          strokeWidth: sourceDone || isTargetActive ? 2 : 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: sourceDone ? "#10b981" : isTargetActive ? "#3b82f6" : "#3f3f46",
          width: 14,
          height: 14,
        },
      };
    });
  }, [executedNodes, currentRunningNode]);

  return (
    <div className="w-full h-full min-h-[750px] relative rounded-2xl border border-zinc-800 bg-[#09090B] overflow-hidden">
      {/* Visual Header */}
      <div className="absolute top-3 left-4 z-10 flex items-center justify-between right-4 pointer-events-none">
        <div className="pointer-events-auto bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              streamStatus === "streaming" && "bg-blue-500 animate-ping",
              streamStatus === "paused_interrupt" && "bg-orange-500 animate-pulse",
              streamStatus === "completed" && "bg-emerald-500",
              streamStatus === "error" && "bg-red-500",
              streamStatus === "idle" && "bg-zinc-500"
            )}
          />
          <span className="text-[11px] font-mono uppercase text-zinc-300">
            Pipeline: {streamStatus.replace("_", " ")}
          </span>
        </div>

        <div className="pointer-events-auto bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 text-[10px] font-mono text-zinc-400">
          8 Nodes • Sequential LangGraph
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        className="touch-none"
      >
        <Background color="#27272a" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!bg-zinc-900 !border-zinc-800 !fill-zinc-400 [&>button]:!border-zinc-800 [&>button:hover]:!bg-zinc-800"
        />
      </ReactFlow>
    </div>
  );
}
