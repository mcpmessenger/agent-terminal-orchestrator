import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select';
import { useSettings } from '@/contexts/SettingsContext';
import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsDialog() {
  const { defaultShell, gatewayWsUrl, update } = useSettings();
  const [open, setOpen] = useState(false);
  const [shell, setShell] = useState<typeof defaultShell>(defaultShell);
  const [wsUrl, setWsUrl] = useState(gatewayWsUrl ?? '');
  const { toast } = useToast();

  const handleSave = () => {
    update({ defaultShell: shell, gatewayWsUrl: wsUrl || undefined });
    toast({ description: 'Settings saved' });
    setOpen(false);
  };

  const handleReset = () => {
    update({ defaultShell: 'bash', gatewayWsUrl: undefined });
    setShell('bash');
    setWsUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Default Shell</Label>
            <Select value={shell} onValueChange={(v)=>setShell(v as any)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="bash">Bash</SelectItem>
                  <SelectItem value="powershell">PowerShell</SelectItem>
                  <SelectItem value="cmd">CMD</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Gateway WebSocket URL (optional)</Label>
            <Input placeholder="ws://host:port/pty" value={wsUrl} onChange={(e)=>setWsUrl(e.target.value)} />
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={handleReset}>Reset</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 