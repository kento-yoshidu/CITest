const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;

  constructor(status: number) {
    super(`API error: ${status}`);
    this.name = "ApiError";
    this.status = status;
  };
}

export async function fetchClient<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);

  if (!res.ok) {
    throw new ApiError(res.status);
  }

  return res.json() as Promise<T>;
}
