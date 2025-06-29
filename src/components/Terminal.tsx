import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";

// Simple wrapper component for a live PTY
export default function Terminal({ runtime = 'powershell' }: { runtime?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

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
    }

    // Connect to local PTY WebSocket
    const ws = new WebSocket(`ws://localhost:8080/pty?shell=${runtime}`);

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
  }, [runtime]);

  return <div className="w-full h-[500px] rounded-md overflow-hidden" ref={containerRef} />;
} 