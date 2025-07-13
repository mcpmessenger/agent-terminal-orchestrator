import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TerminalProvider } from "@/contexts/TerminalContext";
import { McpProvider } from "@/contexts/McpContext";
import { SettingsProvider } from '@/contexts/SettingsContext';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
      <McpProvider>
        <TerminalProvider>
          <App />
        </TerminalProvider>
      </McpProvider>
    </SettingsProvider>
  </React.StrictMode>
);
