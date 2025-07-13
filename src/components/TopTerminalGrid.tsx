import React from "react";
import { useTerminals } from "@/contexts/TerminalContext";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Terminal from "@/components/Terminal";
import DualTerminal from "@/components/DualTerminal";
import { cn } from "@/lib/utils";

export default function TopTerminalGrid() {
  const { sessions, remove } = useTerminals();
  if (sessions.length === 0) return null;
  const items = sessions.slice(0, 5);

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((s) => (
        <li key={s.id} className="min-h-[18rem] list-none">
          <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
            <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl border-[0.75px] bg-background">
              <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-sm font-semibold">{s.name}</h3>
                <button onClick={() => remove(s.id)} className="text-muted-foreground hover:text-destructive">×</button>
              </div>
              <div className="flex-1 rounded-md overflow-hidden p-2 pt-0">
                <Terminal runtime={s.runtime} />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 