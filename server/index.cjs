const express = require("express");
const http = require("http");
const WebSocket = require("ws");
// Remove static node-pty import; we'll load dynamically below
// const pty = require("node-pty");
const os = require("os");
const child_process = require("child_process");
const url = require('url');

const app = express();
const port = process.env.PORT || 8080;

// Create HTTP server and attach Express app (for potential REST endpoints in future)
const server = http.createServer(app);

// WebSocket server specifically for PTY connections
const wss = new WebSocket.Server({ server, path: "/pty" });

let pty;
try {
  pty = require("node-pty");
} catch (err) {
  console.warn("[WARN] node-pty couldn't be loaded. Falling back to child_process.spawn.", err.message);
}

wss.on("connection", (ws, req) => {
  const { query } = url.parse(req.url, true);
  const requestedShell = query.shell || 'powershell';
  // Spawn a shell using node-pty when available, otherwise child_process
  const spawnShell = () => {
    const choose = () => {
      switch(requestedShell){
        case 'cmd': return os.platform()==='win32'?'cmd.exe':'bash';
        case 'wsl': return 'wsl.exe';
        case 'docker-ubuntu': return 'docker';
        default: return os.platform()==='win32'?'powershell.exe':'bash';
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
    // Fallback using child_process.
    const cp = child_process.spawn(shellCmd, shellArgs, {
      cwd: process.cwd(),
      env: process.env,
      stdio: "pipe",
    });
    // Emulate node-pty interface minimally
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

  // Forward PTY output to the websocket client
  ptyProcess.on("data", (data) => {
    ws.send(data);
  });

  // Write data received from client into the PTY
  ws.on("message", (data) => {
    ptyProcess.write(data);
  });

  // Cleanup on socket close
  ws.on("close", () => {
    ptyProcess.kill();
  });
});

server.listen(port, () => {
  console.log(`PTY server listening on http://localhost:${port}`);
}); 