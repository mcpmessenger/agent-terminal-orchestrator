export interface TerminalSession {
  id: string;
  name: string;
  agent: string; // e.g., "Claude", "Gemini"
  status: "running" | "idle" | "stopped";
  repository?: string;
  branch?: string;
  image?: string; // container image or agent docker image
  runtime?: 'powershell' | 'cmd' | 'wsl' | 'docker-ubuntu';
} 