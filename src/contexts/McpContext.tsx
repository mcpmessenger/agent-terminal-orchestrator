import React, { createContext, useContext, useEffect, useState } from "react";

interface McpContextValue {
  isConnected: boolean;
  ping: () => Promise<boolean>;
}

const McpContext = createContext<McpContextValue | undefined>(undefined);

export const useMcp = () => {
  const ctx = useContext(McpContext);
  if (!ctx) throw new Error("useMcp must be used within McpProvider");
  return ctx;
};

export const McpProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setConnected] = useState(false);

  const baseUrl = (() => {
    const proto = window.location.protocol;
    const host = window.location.hostname;
    const port = '8080';
    return `${proto}//${host}:${port}`;
  })();

  const ping = async () => {
    try {
      const res = await fetch(`${baseUrl}/mcp/ping`);
      const ok = res.ok;
      setConnected(ok);
      return ok;
    } catch {
      setConnected(false);
      return false;
    }
  };

  useEffect(() => {
    // initial and periodic ping every 30s
    ping();
    const id = setInterval(ping, 30000);
    return () => clearInterval(id);
  }, []);

  return <McpContext.Provider value={{ isConnected, ping }}>{children}</McpContext.Provider>;
}; 