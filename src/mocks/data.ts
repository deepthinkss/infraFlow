import type { AppGraph, AppSummary } from "../types/domain";

export const apps: AppSummary[] = [
  {
    id: "supertokens-golang",
    name: "supertokens-golang",
    description: "Auth services and backing data stores for the Go runtime.",
    icon: "lightbulb",
    status: "healthy",
  },
  {
    id: "supertokens-java",
    name: "supertokens-java",
    description: "JVM service topology with shared data infrastructure.",
    icon: "settings",
    status: "degraded",
  },
  {
    id: "supertokens-python",
    name: "supertokens-python",
    description: "Python worker services for integrations and events.",
    icon: "rocket",
    status: "healthy",
  },
  {
    id: "supertokens-ruby",
    name: "supertokens-ruby",
    description: "Ruby API tier for legacy customers.",
    icon: "briefcase",
    status: "down",
  },
  {
    id: "supertokens-go",
    name: "supertokens-go",
    description: "Experimental Go service mesh.",
    icon: "puzzle",
    status: "healthy",
  },
];

const baseGraph: AppGraph = {
  nodes: [
    {
      id: "api",
      type: "service",
      position: { x: 40, y: 70 },
      data: {
        label: "Auth API",
        description: "Public API tier handling sessions, users, and token refresh.",
        status: "healthy",
        provider: "aws",
        service: "api",
        allocation: 72,
        replicas: 3,
        runtime: [
          { label: "CPU", value: "0.03 vCPU" },
          { label: "Memory", value: "0.08 GB" },
          { label: "Latency", value: "42 ms" },
        ],
      },
    },
    {
      id: "postgres",
      type: "service",
      position: { x: 560, y: 130 },
      data: {
        label: "Postgres",
        description: "Primary relational store for tenants, users, and sessions.",
        status: "degraded",
        provider: "aws",
        service: "postgres",
        allocation: 54,
        replicas: 2,
        runtime: [
          { label: "CPU", value: "0.02 vCPU" },
          { label: "Memory", value: "0.05 GB" },
          { label: "Disk", value: "10.00 GB" },
        ],
      },
    },
    {
      id: "redis",
      type: "service",
      position: { x: 310, y: 390 },
      data: {
        label: "Redis",
        description: "Hot cache for rate limits, ephemeral sessions, and locks.",
        status: "down",
        provider: "aws",
        service: "redis",
        allocation: 38,
        replicas: 1,
        runtime: [
          { label: "CPU", value: "0.01 vCPU" },
          { label: "Memory", value: "0.03 GB" },
          { label: "Evictions", value: "128" },
        ],
      },
    },
  ],
  edges: [
    { id: "api-postgres", source: "api", target: "postgres", animated: true, data: { label: "SQL" } },
    { id: "api-redis", source: "api", target: "redis", animated: true, data: { label: "Cache" } },
  ],
};

export const graphs: Record<string, AppGraph> = Object.fromEntries(
  apps.map((app, index) => [
    app.id,
    {
      nodes: baseGraph.nodes.map((node, nodeIndex) => ({
        ...node,
        id: `${app.id}-${node.id}`,
        position: {
          x: node.position.x + index * 24,
          y: node.position.y + nodeIndex * 8,
        },
        data: {
          ...node.data,
          label: index === 0 ? node.data.label : `${node.data.label} ${index + 1}`,
        },
      })),
      edges: baseGraph.edges.map((edge) => ({
        ...edge,
        id: `${app.id}-${edge.id}`,
        source: `${app.id}-${edge.source}`,
        target: `${app.id}-${edge.target}`,
      })),
    },
  ]),
);
