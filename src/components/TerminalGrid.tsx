
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Box } from 'lucide-react';

interface Terminal {
  id: string;
  name: string;
  agent: string;
  status: 'running' | 'idle' | 'stopped';
  repository?: string;
  lastCommand?: string;
}

const mockTerminals: Terminal[] = [
  {
    id: 'claude-1',
    name: 'Claude Terminal',
    agent: 'Claude',
    status: 'running',
    repository: 'project-alpha',
    lastCommand: 'git status'
  },
  {
    id: 'gemini-1',
    name: 'Gemini Terminal',
    agent: 'Gemini',
    status: 'idle',
    repository: 'auth-templates',
    lastCommand: 'mcp send --to claude'
  }
];

export function TerminalGrid() {
  const getStatusColor = (status: Terminal['status']) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'stopped':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mockTerminals.map((terminal) => (
        <Card key={terminal.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(terminal.status)}`} />
                <h3 className="font-semibold">{terminal.name}</h3>
              </div>
              <Badge variant="secondary">{terminal.agent}</Badge>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400">
              <div className="text-gray-500">
                [{terminal.agent.toLowerCase()}@{terminal.repository || 'workspace'}]$
              </div>
              <div>{terminal.lastCommand}</div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Box className="h-4 w-4" />
              <span>Repository: {terminal.repository || 'No repository'}</span>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                View Terminal
              </Button>
              <Button size="sm" variant="outline">
                Send MCP Message
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
