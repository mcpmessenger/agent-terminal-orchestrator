import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";
import { useSettings } from '@/contexts/SettingsContext';

// Simple wrapper component for a live PTY
export default function Terminal({ runtime }: { runtime?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gatewayWsUrl, defaultShell } = useSettings();
  const shell = runtime ?? defaultShell;

  useEffect(() => {
    // Initialize xterm instance
    const term = new XTerm({
      cols: 80,
      rows: 24,
      theme: {
        background: getComputedStyle(document.documentElement).getPropertyValue('--terminal-bg') || '#000000',
      },
    });

    if (containerRef.current) {
      term.open(containerRef.current);
      // Fit the terminal size to container (simple)
      term.resize(Math.floor(containerRef.current.clientWidth / 9), 24);
      // Ensure the terminal receives keyboard focus
      term.focus();
      // Focus again on click inside container (helpful on browsers)
      containerRef.current.addEventListener('click', () => term.focus());
    }

    // Connect to PTY WebSocket (use env var fallback)
    const baseUrl = gatewayWsUrl ?? import.meta.env.VITE_PTY_WS_URL ?? (()=>{
      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const host = window.location.hostname;
      const port = '8090'; // Must match docker-compose host port mapping
      return `${proto}://${host}:${port}/pty`;
    })();
    const ws = new WebSocket(`${baseUrl}?shell=${shell}`);

    // Send terminal input over WebSocket
    term.onData((data) => {
      ws.send(data);
    });

    // Display server output in terminal
    ws.onmessage = (event) => {
      term.write(event.data as string);
    };

    // Clean up on unmount
    return () => {
      term.dispose();
      ws.close();
    };
  }, [gatewayWsUrl, runtime]);

  return <div className="w-full h-[500px] rounded-md overflow-hidden" ref={containerRef} />;
} 