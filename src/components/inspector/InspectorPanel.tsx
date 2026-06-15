import { useQueryClient } from "@tanstack/react-query";
import { Activity, Settings2 } from "lucide-react";
import { queryKeys } from "../../hooks/use-app-queries";
import { useWorkspaceStore } from "../../store/workspace-store";
import type { AppGraph, ServiceNode, ServiceStatus, UpdateNodeInput } from "../../types/domain";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

type InspectorPanelProps = {
  appId: string;
  nodes: ServiceNode[];
};

const statusCopy: Record<ServiceStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
};

export function InspectorPanel({ appId, nodes }: InspectorPanelProps) {
  const queryClient = useQueryClient();
  const selectedNodeId = useWorkspaceStore((state) => state.selectedNodeId);
  const activeInspectorTab = useWorkspaceStore((state) => state.activeInspectorTab);
  const setActiveInspectorTab = useWorkspaceStore((state) => state.setActiveInspectorTab);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const updateNode = (updates: UpdateNodeInput) => {
    if (!selectedNode) {
      return;
    }

    queryClient.setQueryData<AppGraph>(queryKeys.graph(appId), (currentGraph) => {
      if (!currentGraph) {
        return currentGraph;
      }

      return {
        ...currentGraph,
        nodes: currentGraph.nodes.map((node) =>
          node.id === selectedNode.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...updates,
                },
              }
            : node,
        ),
      };
    });
  };

  if (!selectedNode) {
    return (
      <div className="flex h-full flex-col justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-center">
        <Settings2 className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
        <h2 className="text-lg font-semibold text-zinc-100">No node selected</h2>
        <p className="mt-2 text-sm text-zinc-500">Select a service card on the canvas to inspect and edit it.</p>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg border border-zinc-800 bg-zinc-950 p-5 text-zinc-100 shadow-2xl">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Inspector</p>
          <h2 className="mt-1 truncate text-xl font-semibold">{selectedNode.data.label}</h2>
        </div>
        <Badge variant={selectedNode.data.status}>{statusCopy[selectedNode.data.status]}</Badge>
      </div>

      <Tabs value={activeInspectorTab} onValueChange={(value) => setActiveInspectorTab(value as "config" | "runtime")}>
        <TabsList>
          <TabsTrigger value="config">
            <Settings2 className="mr-2 h-4 w-4" />
            Config
          </TabsTrigger>
          <TabsTrigger value="runtime">
            <Activity className="mr-2 h-4 w-4" />
            Runtime
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="node-name">Node name</Label>
              <Input
                id="node-name"
                value={selectedNode.data.label}
                onChange={(event) => updateNode({ label: event.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-description">Description</Label>
              <Textarea
                id="node-description"
                value={selectedNode.data.description}
                onChange={(event) => updateNode({ description: event.target.value })}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="allocation">Allocation</Label>
                <span className="text-sm text-zinc-400">{selectedNode.data.allocation}%</span>
              </div>
              <Slider
                id="allocation"
                min={0}
                max={100}
                step={1}
                value={[selectedNode.data.allocation]}
                onValueChange={([allocation]) => updateNode({ allocation: allocation ?? 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allocation-number">Allocation input</Label>
              <Input
                id="allocation-number"
                type="number"
                min={0}
                max={100}
                value={selectedNode.data.allocation}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  updateNode({ allocation: Number.isFinite(nextValue) ? Math.min(100, Math.max(0, nextValue)) : 0 });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="replicas">Replicas</Label>
              <Input
                id="replicas"
                type="number"
                min={0}
                value={selectedNode.data.replicas}
                onChange={(event) => updateNode({ replicas: Math.max(0, Number(event.target.value) || 0) })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="runtime">
          <div className="space-y-3">
            {selectedNode.data.runtime.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between rounded-md border border-zinc-800 bg-black p-3">
                <span className="text-sm text-zinc-400">{metric.label}</span>
                <span className="text-sm font-semibold text-zinc-100">{metric.value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
