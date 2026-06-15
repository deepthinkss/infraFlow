import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type EdgeChange,
  type NodeChange,
  type NodeTypes,
  type OnNodesDelete,
} from "@xyflow/react";
import { Maximize2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../hooks/use-app-queries";
import { useWorkspaceStore } from "../../store/workspace-store";
import type { AppGraph, ServiceEdge, ServiceNode as ServiceNodeType } from "../../types/domain";
import { Button } from "../ui/button";
import { ServiceNode } from "./ServiceNode";

const nodeTypes = {
  service: ServiceNode,
} satisfies NodeTypes;

type AppFlowProps = {
  appId: string;
  graph: AppGraph;
};

export function AppFlow(props: AppFlowProps) {
  return (
    <ReactFlowProvider>
      <FlowInner {...props} />
    </ReactFlowProvider>
  );
}

function FlowInner({ appId, graph }: AppFlowProps) {
  const queryClient = useQueryClient();
  const { fitView } = useReactFlow();
  const selectedNodeId = useWorkspaceStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useWorkspaceStore((state) => state.setSelectedNodeId);
  const setMobilePanelOpen = useWorkspaceStore((state) => state.setMobilePanelOpen);

  const selectedNodes = useMemo(
    () => graph.nodes.map((node) => ({ ...node, selected: node.id === selectedNodeId })),
    [graph.nodes, selectedNodeId],
  );

  const persistGraph = useCallback(
    (nextNodes: ServiceNodeType[], nextEdges = graph.edges) => {
      queryClient.setQueryData<AppGraph>(queryKeys.graph(appId), {
        nodes: nextNodes,
        edges: nextEdges,
      });
    },
    [appId, graph.edges, queryClient],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<ServiceNodeType>[]) => {
      persistGraph(applyNodeChanges(changes, graph.nodes));
    },
    [graph.nodes, persistGraph],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<ServiceEdge>[]) => {
      persistGraph(graph.nodes, applyEdgeChanges(changes, graph.edges));
    },
    [graph.edges, graph.nodes, persistGraph],
  );

  const onNodesDelete: OnNodesDelete<ServiceNodeType> = useCallback(
    (deletedNodes) => {
      const deletedIds = new Set(deletedNodes.map((node) => node.id));
      const nextNodes = graph.nodes.filter((node) => !deletedIds.has(node.id));
      const nextEdges = graph.edges.filter((edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target));
      persistGraph(nextNodes, nextEdges);

      if (selectedNodeId && deletedIds.has(selectedNodeId)) {
        setSelectedNodeId(null);
        setMobilePanelOpen(false);
      }
    },
    [graph.edges, graph.nodes, persistGraph, selectedNodeId, setMobilePanelOpen, setSelectedNodeId],
  );

  return (
    <div className="h-full w-full">
      <ReactFlow<ServiceNodeType, ServiceEdge>
        nodes={selectedNodes}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id);
          setMobilePanelOpen(true);
        }}
        onPaneClick={() => {
          setSelectedNodeId(null);
          setMobilePanelOpen(false);
        }}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
        minZoom={0.35}
        maxZoom={1.4}
        className="bg-[#090a0c]"
      >
        <Background variant={BackgroundVariant.Dots} color="#27272a" gap={22} size={1.4} />
        <Controls position="bottom-left" showInteractive={false} />
      </ReactFlow>
      <Button
        className="absolute bottom-6 right-[340px] z-10 hidden lg:inline-flex"
        variant="outline"
        onClick={() => void fitView({ padding: 0.2, duration: 300 })}
      >
        <Maximize2 className="h-4 w-4" />
        Fit view
      </Button>
    </div>
  );
}
