import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Cpu, Database, HardDrive, MemoryStick, Server, Settings } from "lucide-react";
import { Badge } from "../ui/badge";
import type { ServiceNode as ServiceNodeType } from "../../types/domain";

const serviceIcon = {
  api: Server,
  postgres: Database,
  redis: Database,
  mongodb: Database,
};

const statusLabel = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
};

export function ServiceNode({ data, selected }: NodeProps<ServiceNodeType>) {
  const Icon = serviceIcon[data.service];

  return (
    <div
      className={`w-[360px] rounded-lg border bg-black p-5 text-white shadow-2xl transition ${
        selected ? "border-sky-400 shadow-sky-500/20" : "border-zinc-900"
      }`}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white text-zinc-950">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{data.label}</h3>
            <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{data.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-md border border-emerald-500/40 px-2 py-1 text-xs font-semibold text-emerald-300">
            $0.03/HR
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-md bg-slate-900 text-zinc-200">
            <Settings className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2 text-center text-xs text-zinc-200">
        <div>
          <div>{Math.max(0.01, data.allocation / 1000).toFixed(2)}</div>
          <div className="mt-2 flex items-center justify-center gap-1 rounded-md bg-white px-2 py-2 text-zinc-950">
            <Cpu className="h-4 w-4" />
            CPU
          </div>
        </div>
        <div>
          <div>0.05 GB</div>
          <div className="mt-2 flex items-center justify-center gap-1 rounded-md bg-slate-900 px-2 py-2 text-zinc-200">
            <MemoryStick className="h-4 w-4" />
            Memory
          </div>
        </div>
        <div>
          <div>10.00 GB</div>
          <div className="mt-2 flex items-center justify-center gap-1 rounded-md bg-slate-900 px-2 py-2 text-zinc-200">
            <HardDrive className="h-4 w-4" />
            Disk
          </div>
        </div>
        <div>
          <div>{data.replicas}</div>
          <div className="mt-2 flex items-center justify-center gap-1 rounded-md bg-slate-900 px-2 py-2 text-zinc-200">
            <Database className="h-4 w-4" />
            Region
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-sky-500 via-emerald-400 to-red-500">
          <div className="h-4 w-4 -translate-y-1 rounded-full bg-white" style={{ marginLeft: `${data.allocation}%` }} />
        </div>
        <div className="w-20 rounded-md border border-zinc-800 bg-black px-3 py-2 text-right text-sm">
          {(data.allocation / 100).toFixed(2)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant={data.status}>{statusLabel[data.status]}</Badge>
        <span className="text-lg font-bold text-orange-400">{data.provider}</span>
      </div>
    </div>
  );
}
