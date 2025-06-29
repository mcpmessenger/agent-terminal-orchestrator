const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const os = require("os");
const child_process = require("child_process");
const url = require('url');

const app = express();
const port = process.env.PORT || 8080;

// Simple health endpoint
app.get('/health', (req,res)=>res.json({status:'healthy', service:'gateway', timestamp: new Date().toISOString()}));

const server = http.createServer(app);

// PTY WebSocket endpoint
const wss = new WebSocket.Server({ server, path: "/pty" });

let pty;
try {
  pty = require("node-pty");
} catch (err) {
  console.warn("[WARN] node-pty couldn't be loaded. Falling back to child_process.spawn.", err.message);
}

wss.on("connection", (ws, req) => {
  const { query } = url.parse(req.url, true);
  const requestedShell = query.shell || 'bash';

  const spawnShell = () => {
    const choose = () => {
      switch(requestedShell){
        case 'cmd': return os.platform()==='win32'?'cmd.exe':'bash';
        case 'powershell': return os.platform()==='win32'?'powershell.exe':'bash';
        case 'wsl': return 'wsl.exe';
        case 'docker-ubuntu': return 'docker';
        default: return 'bash';
      }
    };
    const shellCmd = choose();
    const shellArgs = requestedShell==='docker-ubuntu'?['run','-it','--rm','-v',`${process.cwd()}:\/workspace`,'ubuntu:latest','bash']: requestedShell==='wsl'?['bash']:[];

    if (pty) {
      return pty.spawn(shellCmd, shellArgs, {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: process.cwd(),
        env: process.env,
      });
    }
    // child_process fallback (no TTY capability)
    const cp = child_process.spawn(shellCmd, shellArgs, {
      cwd: process.cwd(),
      env: process.env,
      stdio: "pipe",
    });
    return {
      write: (data) => cp.stdin.write(data),
      kill: () => cp.kill(),
      on: (event, cb) => {
        if (event === "data") {
          cp.stdout.on("data", (d) => cb(d.toString("utf8")));
          cp.stderr.on("data", (d) => cb(d.toString("utf8")));
        }
      },
    };
  };

  const ptyProcess = spawnShell();

  ptyProcess.on("data", (data) => {
    ws.send(data);
  });

  ws.on("message", (data) => {
    ptyProcess.write(data);
  });

  ws.on("close", () => {
    ptyProcess.kill();
  });
});

server.listen(port, () => console.log(`Gateway listening on :${port}`)); 