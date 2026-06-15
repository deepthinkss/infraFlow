import { Boxes, Braces, Database, Github, Network, Package, ServerCog } from "lucide-react";
import { Button } from "../ui/button";

const railItems = [
  { label: "GitHub", icon: Github, active: true },
  { label: "Postgres", icon: Database },
  { label: "Redis", icon: ServerCog },
  { label: "Services", icon: Boxes },
  { label: "Packages", icon: Package },
  { label: "Functions", icon: Braces },
  { label: "Topology", icon: Network },
];

export function IconRail() {
  return (
    <aside className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-lg border border-zinc-800 bg-zinc-950/95 p-1 shadow-xl lg:block">
      <nav className="flex flex-col gap-1">
        {railItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            size="icon"
            aria-label={item.label}
            className={item.active ? "text-white" : "text-zinc-500"}
          >
            <item.icon className="h-5 w-5" />
          </Button>
        ))}
      </nav>
    </aside>
  );
}
