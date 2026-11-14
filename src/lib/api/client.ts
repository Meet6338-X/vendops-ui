export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const isServer = typeof window === "undefined";
  const baseUrl = isServer
    ? process.env.BACKEND_URL || "http://localhost:8000"
    : "";

  const finalUrl = isServer
    ? url.replace(/^\/api\/backend/, `${baseUrl}/api/v1`)
    : url;

  const res = await fetch(finalUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errorDetail = "";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = await res.text();
    }
    throw new ApiError(res.status, errorDetail || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}
