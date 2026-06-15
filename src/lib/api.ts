import type { AppGraph, AppSummary } from "../types/domain";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export function getApps() {
  return getJson<AppSummary[]>("/api/apps");
}

export function getAppGraph(appId: string) {
  return getJson<AppGraph>(`/api/apps/${appId}/graph`);
}
