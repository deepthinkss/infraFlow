import { PanelRightOpen } from "lucide-react";
import { useMemo } from "react";
import { useAppsQuery, useAppGraphQuery } from "../../hooks/use-app-queries";
import { useWorkspaceStore } from "../../store/workspace-store";
import { AppFlow } from "../flow/AppFlow";
import { InspectorPanel } from "../inspector/InspectorPanel";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";
import { AppsPanel } from "./AppsPanel";
import { IconRail } from "./IconRail";
import { TopBar } from "./TopBar";

export function Workspace() {
  const selectedAppId = useWorkspaceStore((state) => state.selectedAppId);
  const isMobilePanelOpen = useWorkspaceStore((state) => state.isMobilePanelOpen);
  const setMobilePanelOpen = useWorkspaceStore((state) => state.setMobilePanelOpen);
  const selectedNodeId = useWorkspaceStore((state) => state.selectedNodeId);
  const { data: apps } = useAppsQuery();
  const graphQuery = useAppGraphQuery(selectedAppId);

  const selectedApp = useMemo(
    () => apps?.find((app) => app.id === selectedAppId),
    [apps, selectedAppId],
  );

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#090a0c]">
      <TopBar selectedApp={selectedApp} />
      <IconRail />
      <AppsPanel />

      <section className="h-full pt-0 xl:pl-[360px] lg:pr-[320px]">
        {graphQuery.isLoading ? (
          <div className="grid h-full place-items-center">
            <div className="w-[min(520px,80vw)] space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-4/5" />
              <Skeleton className="h-32 w-3/5" />
            </div>
          </div>
        ) : null}

        {graphQuery.isError ? (
          <div className="grid h-full place-items-center px-6">
            <div className="max-w-md rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center text-red-100">
              <h2 className="text-lg font-semibold">Graph failed to load</h2>
              <p className="mt-2 text-sm text-red-200/80">The mock API returned an error for this application graph.</p>
              <Button className="mt-4" variant="outline" onClick={() => void graphQuery.refetch()}>
                Retry
              </Button>
            </div>
          </div>
        ) : null}

        {selectedAppId && graphQuery.data ? <AppFlow appId={selectedAppId} graph={graphQuery.data} /> : null}
      </section>

      {selectedAppId && graphQuery.data ? (
        <aside className="absolute bottom-5 right-5 top-24 z-10 hidden w-[295px] lg:block">
          <InspectorPanel appId={selectedAppId} nodes={graphQuery.data.nodes} />
        </aside>
      ) : null}

      <Button
        className="absolute bottom-5 right-5 z-20 lg:hidden"
        size="icon"
        variant="secondary"
        aria-label="Open inspector"
        disabled={!selectedNodeId}
        onClick={() => setMobilePanelOpen(true)}
      >
        <PanelRightOpen className="h-5 w-5" />
      </Button>

      {selectedAppId && graphQuery.data ? (
        <Sheet open={isMobilePanelOpen} onOpenChange={setMobilePanelOpen}>
          <SheetContent>
            <SheetTitle className="sr-only">Node inspector</SheetTitle>
            <InspectorPanel appId={selectedAppId} nodes={graphQuery.data.nodes} />
          </SheetContent>
        </Sheet>
      ) : null}
    </main>
  );
}
