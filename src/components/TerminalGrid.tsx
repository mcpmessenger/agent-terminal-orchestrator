import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTerminals } from '@/contexts/TerminalContext';
import Terminal from '@/components/Terminal';
import { X, GitBranch, FolderGit2 } from 'lucide-react';
import GlowWrapper from './GlowWrapper';

export function TerminalGrid() {
  const { sessions, remove } = useTerminals();

  if (sessions.length === 0) {
    return <p className="text-muted-foreground">No active terminals. Click "New Terminal" to start one.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sessions.map((session) => (
        <GlowWrapper key={session.id}>
          <Card className="p-4 space-y-3 bg-background rounded-lg group-hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{session.name}</div>
              <Button size="icon" variant="ghost" onClick={() => remove(session.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[300px] rounded-md overflow-hidden">
              <Terminal runtime={session.runtime} />
            </div>
            {(session.repository || session.branch) && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                {session.repository && (
                  <span className="flex items-center gap-1"><FolderGit2 className="h-4 w-4" />{session.repository}</span>
                )}
                {session.branch && (
                  <span className="flex items-center gap-1"><GitBranch className="h-4 w-4" />{session.branch}</span>
                )}
              </div>
            )}
          </Card>
        </GlowWrapper>
      ))}
    </div>
  );
}
