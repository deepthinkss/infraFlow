import type { Edge, Node } from "@xyflow/react";

export type ServiceStatus = "healthy" | "degraded" | "down";

export type AppSummary = {
  id: string;
  name: string;
  description: string;
  icon: "lightbulb" | "settings" | "rocket" | "briefcase" | "puzzle";
  status: ServiceStatus;
};

export type RuntimeMetric = {
  label: string;
  value: string;
};

export type ServiceNodeData = {
  label: string;
  description: string;
  status: ServiceStatus;
  provider: "aws" | "gcp" | "azure";
  service: "api" | "postgres" | "redis" | "mongodb";
  allocation: number;
  replicas: number;
  runtime: RuntimeMetric[];
};

export type ServiceNode = Node<ServiceNodeData, "service">;

export type ServiceEdge = Edge<{ label?: string }>;

export type AppGraph = {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
};

export type UpdateNodeInput = Partial<
  Pick<ServiceNodeData, "label" | "description" | "allocation" | "replicas">
>;
