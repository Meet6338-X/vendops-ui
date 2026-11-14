import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export async function initMocks() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_MOCKS === "1") {
    await worker.start({
      onUnhandledRequest: "bypass",
    });
    console.log("[MSW] Mock Service Worker activated.");
  }
}
