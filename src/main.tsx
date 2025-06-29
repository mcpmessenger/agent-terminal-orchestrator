import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TerminalProvider } from "@/contexts/TerminalContext";
import { McpProvider } from "@/contexts/McpContext";

createRoot(document.getElementById("root")!).render(
  <McpProvider>
    <TerminalProvider>
      <App />
    </TerminalProvider>
  </McpProvider>
);
