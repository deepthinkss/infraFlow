import { useQuery } from "@tanstack/react-query";
import { getAppGraph, getApps } from "../lib/api";

export const queryKeys = {
  apps: ["apps"] as const,
  graph: (appId: string) => ["apps", appId, "graph"] as const,
};

export function useAppsQuery() {
  return useQuery({
    queryKey: queryKeys.apps,
    queryFn: getApps,
    staleTime: 60_000,
  });
}

export function useAppGraphQuery(appId: string | null) {
  return useQuery({
    queryKey: appId ? queryKeys.graph(appId) : ["apps", "empty", "graph"],
    queryFn: () => getAppGraph(appId ?? ""),
    enabled: Boolean(appId),
    staleTime: 30_000,
  });
}
