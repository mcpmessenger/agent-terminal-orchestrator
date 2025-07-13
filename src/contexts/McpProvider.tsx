import React, { useEffect, useState, useCallback } from "react";
import { McpContext } from "./McpContext";

export const McpProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setConnected] = useState(false);

  const baseUrl = (() => {
    const proto = window.location.protocol;
    const host = window.location.hostname;
    const port = '8080';
    return `${proto}//${host}:${port}`;
  })();

  const ping = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/mcp/ping`);
      const ok = res.ok;
      setConnected(ok);
      return ok;
    } catch {
      setConnected(false);
      return false;
    }
  }, [baseUrl, setConnected]);

  useEffect(() => {
    // initial and periodic ping every 30s
    ping();
    const id = setInterval(ping, 30000);
    return () => clearInterval(id);
  }, [ping]);

  return <McpContext.Provider value={{ isConnected, ping }}>{children}</McpContext.Provider>;
};