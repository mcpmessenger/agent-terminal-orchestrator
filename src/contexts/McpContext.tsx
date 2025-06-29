import React, { createContext, useContext, useEffect, useState } from "react";

interface McpContextValue {
  isConnected: boolean;
  send: (payload: any) => void;
}

const McpContext = createContext<McpContextValue | undefined>(undefined);

export const useMcp = () => {
  const ctx = useContext(McpContext);
  if (!ctx) throw new Error("useMcp must be used within McpProvider");
  return ctx;
};

export const McpProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9000/mcp");
    setSocket(ws);
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    return () => ws.close();
  }, []);

  const send = (payload: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    }
  };

  return (
    <McpContext.Provider value={{ isConnected, send }}>{children}</McpContext.Provider>
  );
}; 