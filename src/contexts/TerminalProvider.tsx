import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { TerminalSession } from "@/types/terminal";
import { useSettings } from './use-settings';
import { TerminalContext } from "./TerminalContext";

export const TerminalProvider = ({ children }: { children: React.ReactNode }) => {
  const { defaultShell } = useSettings();
  const [sessions, setSessions] = useState<TerminalSession[]>(() => {
    const stored = localStorage.getItem("terminal-sessions");
    return stored ? (JSON.parse(stored) as TerminalSession[]) : [];
  });

  // persist
  useEffect(() => {
    localStorage.setItem("terminal-sessions", JSON.stringify(sessions));
  }, [sessions]);

  const add = (details: Partial<Omit<TerminalSession, "id" | "status">> = {}) => {
    const agent = details.agent ?? "local";
    setSessions((prev) => [
      ...prev,
      {
        id: nanoid(6),
        name: details.name ?? `${agent} Terminal`,
        agent,
        status: "running",
        repository: details.repository,
        branch: details.branch,
        image: details.image,
        runtime: details.runtime ?? defaultShell,
      },
    ]);
  };

  const remove = (id: string) => setSessions((prev) => prev.filter((s) => s.id !== id));

  return (
    <TerminalContext.Provider value={{ sessions, add, remove }}>
      {children}
    </TerminalContext.Provider>
  );
};