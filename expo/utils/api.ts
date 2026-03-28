import { config } from "@/utils/config";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const url = `${config.apiBaseUrl}${path}`;
  console.log("apiGet", url);
  try {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) {
      const text = await res.text();
      return { error: `GET ${path} failed: ${res.status} ${text}` };
    }
    const json = (await res.json()) as T;
    return { data: json };
  } catch (e) {
    console.log("apiGet error", e);
    return { error: (e as Error).message };
  }
}

export async function apiPost<TBody extends Record<string, unknown>, TResp>(
  path: string,
  body: TBody,
): Promise<ApiResponse<TResp>> {
  const url = `${config.apiBaseUrl}${path}`;
  console.log("apiPost", url, body);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { error: `POST ${path} failed: ${res.status} ${text}` };
    }
    const json = (await res.json()) as TResp;
    return { data: json };
  } catch (e) {
    console.log("apiPost error", e);
    return { error: (e as Error).message };
  }
}
