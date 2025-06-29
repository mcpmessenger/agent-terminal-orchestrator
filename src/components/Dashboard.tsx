import React from 'react';
import { Header } from './Header';
import TopTerminalGrid from './TopTerminalGrid';
import NewTerminalDialog from './NewTerminalDialog';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-8 space-y-8">
        {/* Controls and Top Terminals */}
        <section className="space-y-6">
          <div className="flex justify-center">
            <NewTerminalDialog />
          </div>
          <TopTerminalGrid />
        </section>

        {/* Top-terminals is now the only content */}
      </main>
    </div>
  );
}
