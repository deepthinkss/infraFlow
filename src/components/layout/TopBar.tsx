import { ChevronDown, Moon, MoreHorizontal, Share2, Sun, Workflow } from "lucide-react";
import { Button } from "../ui/button";
import type { AppSummary } from "../../types/domain";

type TopBarProps = {
  selectedApp?: AppSummary;
};

export function TopBar({ selectedApp }: TopBarProps) {
  return (
    <header className="absolute left-5 right-5 top-4 z-20 flex items-center justify-between">
      <div className="flex h-12 items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/90 px-3 shadow-xl backdrop-blur">
        <div className="grid h-8 w-8 place-items-center rounded bg-white text-zinc-950">
          <Workflow className="h-5 w-5" />
        </div>
        <div className="grid h-8 w-8 place-items-center rounded-md bg-indigo-500 text-white">
          <Moon className="h-4 w-4" />
        </div>
        <span className="max-w-[38vw] truncate text-sm font-semibold text-zinc-100">
          {selectedApp?.name ?? "Loading application"}
        </span>
        <Button variant="ghost" size="icon" aria-label="Collapse application menu">
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="More application actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="hidden h-12 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/90 px-2 shadow-xl backdrop-blur sm:flex">
        <Button variant="ghost" size="icon" aria-label="Share topology">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" aria-label="Toggle dark mode">
          <Moon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Toggle light mode">
          <Sun className="h-4 w-4" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-fuchsia-400 via-sky-400 to-amber-300" />
      </div>
    </header>
  );
}
