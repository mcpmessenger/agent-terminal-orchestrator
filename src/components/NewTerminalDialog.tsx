import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box } from "lucide-react";
import { useTerminals } from "@/contexts/TerminalContext";

const runtimeOptions = [
  { value: 'powershell', label: 'PowerShell' },
  { value: 'cmd', label: 'CMD' },
  { value: 'wsl', label: 'WSL Bash' },
  { value: 'docker-ubuntu', label: 'Docker Ubuntu' },
];

export default function NewTerminalDialog() {
  const { add } = useTerminals();
  const [open, setOpen] = useState(false);
  const [agent, setAgent] = useState("local");
  const [name, setName] = useState("");
  const [repository, setRepository] = useState("");
  const [branch, setBranch] = useState("main");
  const [runtime, setRuntime] = useState<'powershell' | 'cmd' | 'wsl' | 'docker-ubuntu'>('powershell');

  const handleCreate = () => {
    add({ agent, name: name || undefined, repository: repository || undefined, branch: branch || undefined, runtime });
    setOpen(false);
    // reset
    setName("");
    setRepository("");
    setBranch("main");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Box className="h-4 w-4 mr-2" />
          New Terminal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New Terminal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Claude Terminal" />
          </div>
          <div className="space-y-1">
            <Label>Agent</Label>
            <Select value={agent} onValueChange={setAgent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="local">Local Shell</SelectItem>
                  <SelectItem value="Claude">Claude</SelectItem>
                  <SelectItem value="Gemini">Gemini</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Repository (optional)</Label>
            <Input value={repository} onChange={(e) => setRepository(e.target.value)} placeholder="project-alpha" />
          </div>
          <div className="space-y-1">
            <Label>Branch (optional)</Label>
            <Input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="main" />
          </div>
          <div className="space-y-1">
            <Label>Shell Runtime</Label>
            <Select value={runtime} onValueChange={(v)=>setRuntime(v as any)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select runtime"/></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {runtimeOptions.map(o=>(
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleCreate}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 