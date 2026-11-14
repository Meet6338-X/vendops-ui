import { handlers } from "./handlers";

export async function initMocks() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_MOCKS === "1") {
    const { setupWorker } = await import("msw/browser");
    const worker = setupWorker(...handlers);
    await worker.start({
      onUnhandledRequest: "bypass",
    });
    console.log("[MSW] Mock Service Worker activated.");
  }
}
