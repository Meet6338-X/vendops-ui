"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { VendOpsState, VendOpsStateSchema } from "../schemas/dispute";
import {
  SSEEndDataSchema,
  SSEInterruptDataSchema,
  SSENodeTransitionDataSchema,
  SSETokenDataSchema,
} from "../schemas/sse";

export type StreamStatus = "idle" | "connecting" | "streaming" | "paused_interrupt" | "completed" | "error";

export interface DisputeSSEState {
  status: StreamStatus;
  currentRunningNode: string | null;
  executedNodes: string[];
  nodeUpdates: Record<string, unknown>;
  tokens: string;
  pendingInterrupt: {
    reason?: string;
    action?: string;
    amount?: number;
    evidence?: string[];
    proposal?: unknown;
  } | null;
  state: Partial<VendOpsState>;
  error: string | null;
}

export function useDisputeSSE(threadId: string | null, autoStart = true) {
  const [data, setData] = useState<DisputeSSEState>({
    status: "idle",
    currentRunningNode: null,
    executedNodes: [],
    nodeUpdates: {},
    tokens: "",
    pendingInterrupt: null,
    state: {},
    error: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!threadId) return;
    cleanup();

    setData((prev) => ({ ...prev, status: "connecting", error: null }));

    const url = `/api/backend/disputes/${encodeURIComponent(threadId)}/stream`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener("open", () => {
      reconnectAttemptsRef.current = 0;
      setData((prev) => ({ ...prev, status: "streaming" }));
    });

    es.addEventListener("node_transition", (event: MessageEvent) => {
      try {
        const raw = JSON.parse(event.data);
        const parsed = SSENodeTransitionDataSchema.parse(raw);
        setData((prev) => {
          const executed = prev.executedNodes.includes(parsed.node)
            ? prev.executedNodes
            : [...prev.executedNodes, parsed.node];
          return {
            ...prev,
            status: "streaming",
            currentRunningNode: parsed.node,
            executedNodes: executed,
            nodeUpdates: {
              ...prev.nodeUpdates,
              [parsed.node]: parsed.update,
            },
            state: {
              ...prev.state,
              ...(parsed.update || {}),
            },
          };
        });
      } catch (err) {
        console.warn("Failed to parse node_transition SSE event:", err);
      }
    });

    es.addEventListener("interrupt", (event: MessageEvent) => {
      try {
        const raw = JSON.parse(event.data);
        const parsed = SSEInterruptDataSchema.parse(raw);
        const intrObj = typeof parsed.interrupt === "object" ? parsed.interrupt : {};
        setData((prev) => ({
          ...prev,
          status: "paused_interrupt",
          currentRunningNode: "hitl_gate",
          executedNodes: prev.executedNodes.includes("hitl_gate")
            ? prev.executedNodes
            : [...prev.executedNodes, "hitl_gate"],
          pendingInterrupt: intrObj,
        }));
      } catch (err) {
        console.warn("Failed to parse interrupt SSE event:", err);
      }
    });

    es.addEventListener("token", (event: MessageEvent) => {
      try {
        const raw = JSON.parse(event.data);
        const parsed = SSETokenDataSchema.parse(raw);
        setData((prev) => ({
          ...prev,
          tokens: prev.tokens + parsed.token,
        }));
      } catch (err) {
        console.warn("Failed to parse token SSE event:", err);
      }
    });

    es.addEventListener("end", (event: MessageEvent) => {
      try {
        const raw = JSON.parse(event.data);
        const parsed = SSEEndDataSchema.parse(raw);
        const finalState = VendOpsStateSchema.safeParse(parsed.final_state);
        setData((prev) => ({
          ...prev,
          status: "completed",
          currentRunningNode: null,
          state: finalState.success ? finalState.data : { ...prev.state, ...(parsed.final_state as any) },
        }));
      } catch (err) {
        setData((prev) => ({ ...prev, status: "completed" }));
      }
      cleanup();
    });

    es.addEventListener("error", (event: MessageEvent) => {
      if (es.readyState === EventSource.CLOSED) {
        // Normal closure or server-initiated disconnect
        setData((prev) => {
          if (prev.status === "streaming" && prev.executedNodes.length > 0) {
            return { ...prev, status: "completed" };
          }
          return prev;
        });
        return;
      }

      // If error payload came from backend
      if (event.data) {
        try {
          const errData = JSON.parse(event.data);
          setData((prev) => ({
            ...prev,
            status: "error",
            error: errData.error || "Stream terminated with error",
          }));
          cleanup();
          return;
        } catch {
          // not json
        }
      }

      // Reconnect with backoff up to 3 attempts
      if (reconnectAttemptsRef.current < 3) {
        reconnectAttemptsRef.current += 1;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 5000);
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      } else {
        setData((prev) => ({
          ...prev,
          status: "error",
          error: "Connection lost to dispute stream.",
        }));
        cleanup();
      }
    });
  }, [threadId, cleanup]);

  useEffect(() => {
    if (autoStart && threadId) {
      connect();
    }
    return cleanup;
  }, [threadId, autoStart, connect, cleanup]);

  return {
    ...data,
    reconnect: connect,
    stop: cleanup,
  };
}
