import React from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import Terminal from '@/components/Terminal';
import GlowWrapper from '@/components/GlowWrapper';
import { TerminalSession } from '@/types/terminal';
import { GlowingEffect } from '@/components/ui/glowing-effect';

export default function DualTerminal({ left, right }: { left: TerminalSession; right: TerminalSession }) {
  return (
    <div className="w-full h-[70vh]">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50} className="p-2">
          <GlowWrapper className="h-full">
            <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} />
            <div className="relative rounded-md bg-background h-full overflow-hidden p-1">
              <Terminal runtime={left.runtime} />
            </div>
          </GlowWrapper>
        </Panel>
        <Panel defaultSize={50} className="p-2">
          <GlowWrapper className="h-full">
            <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} />
            <div className="relative rounded-md bg-background h-full overflow-hidden p-1">
              <Terminal runtime={right.runtime} />
            </div>
          </GlowWrapper>
        </Panel>
      </PanelGroup>
    </div>
  );
} 