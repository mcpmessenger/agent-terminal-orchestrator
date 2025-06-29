import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTerminals } from '@/contexts/TerminalContext';
import { useMcp } from '@/contexts/McpContext';
import SettingsDialog from './SettingsDialog';

export function Header() {
  const { sessions } = useTerminals();
  const activeCount = sessions.length;
  const { isConnected } = useMcp();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Box className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Agent Terminal Orchestrator</h1>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Multi-Agent
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${activeCount>0?'bg-green-500':'bg-border'}`} />
              <span>{activeCount} Active</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected?'bg-blue-500':'bg-border'}`} />
              <span>{isConnected? 'MCP Connected':'MCP Disconnected'}</span>
            </div>
          </div>
          
          <ThemeToggle />
          <SettingsDialog />
        </div>
      </div>
    </header>
  );
}
