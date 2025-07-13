import { Button } from '@/components/ui/button';
import { Box } from 'lucide-react';
import { useTerminals } from '@/contexts/TerminalContext';

export default function NewTerminalButton() {
  const { add } = useTerminals();
  return (
    <Button variant="outline" size="sm" onClick={() => add()}>
      <Box className="h-4 w-4 mr-2" />
      New Terminal
    </Button>
  );
} 