// lib/http.ts
export class HttpError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message?: string
  ) {
    super(message ?? "HTTP Error")
  }
}

const DEFAULT_TIMEOUT = 10000

export async function http<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {

    const res = await fetch(url, {
      ...options,
      credentials: "include",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!res.ok) {
      const error = await res.json().catch(() => null)

      throw new HttpError(
        res.status,
        error,
        error?.message
      )
    }

    return await res.json()

  } finally {
    clearTimeout(timeout)
  }
}