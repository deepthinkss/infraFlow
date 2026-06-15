import { Briefcase, ChevronRight, Lightbulb, Plus, Puzzle, Rocket, Search, Settings } from "lucide-react";
import { useEffect } from "react";
import { useAppsQuery } from "../../hooks/use-app-queries";
import { useWorkspaceStore } from "../../store/workspace-store";
import type { AppSummary } from "../../types/domain";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const iconMap = {
  lightbulb: Lightbulb,
  settings: Settings,
  rocket: Rocket,
  briefcase: Briefcase,
  puzzle: Puzzle,
} satisfies Record<AppSummary["icon"], typeof Lightbulb>;

export function AppsPanel() {
  const { data: apps, isLoading, isError, refetch } = useAppsQuery();
  const selectedAppId = useWorkspaceStore((state) => state.selectedAppId);
  const setSelectedAppId = useWorkspaceStore((state) => state.setSelectedAppId);

  useEffect(() => {
    if (!selectedAppId && apps?.[0]) {
      setSelectedAppId(apps[0].id);
    }
  }, [apps, selectedAppId, setSelectedAppId]);

  return (
    <aside className="absolute left-20 top-24 z-10 hidden w-[310px] rounded-lg border border-zinc-900 bg-black/95 p-6 shadow-2xl xl:block">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Application</h1>
      </div>

      <div className="mb-5 flex gap-2">
        <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md bg-zinc-900 px-3 text-zinc-500">
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate text-sm">Search...</span>
        </div>
        <Button size="icon" aria-label="Add application">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          Apps failed to load.
          <Button className="mt-3 w-full" variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : null}

      <div className="space-y-3">
        {apps?.map((app) => {
          const Icon = iconMap[app.icon];
          const isSelected = app.id === selectedAppId;

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => setSelectedAppId(app.id)}
              className="flex w-full items-center gap-3 rounded-md p-1 text-left transition hover:bg-zinc-900"
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${isSelected ? "bg-indigo-500" : "bg-violet-500"}`}>
                <Icon className="h-5 w-5 text-white" />
              </span>
              <span className="min-w-0 flex-1 truncate font-medium text-zinc-100">{app.name}</span>
              <ChevronRight className="h-4 w-4 text-zinc-400" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
