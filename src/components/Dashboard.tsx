
import React from 'react';
import { Header } from './Header';
import { TerminalGrid } from './TerminalGrid';
import { GlowingEffectDemo } from '@/components/ui/demo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Sparkles, Lock, Settings, Search } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">
            Multi-Agent Terminal Orchestrator
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Orchestrate multiple AI agents in isolated Docker containers with full git integration 
            and real-time collaboration through MCP protocol.
          </p>
        </section>

        {/* Feature Cards */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold text-center">Platform Features</h3>
          <GlowingEffectDemo />
        </section>

        {/* Active Terminals */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Active Terminals</h3>
            <Button>
              <Box className="h-4 w-4 mr-2" />
              New Terminal
            </Button>
          </div>
          <TerminalGrid />
        </section>

        {/* MCP Status */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold">MCP Communication</h3>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <h4 className="font-semibold">Server Status</h4>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-semibold">Messages</h4>
                <p className="text-sm text-muted-foreground">47 exchanged</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="font-semibold">Security</h4>
                <p className="text-sm text-muted-foreground">Encrypted</p>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
