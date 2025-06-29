const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const os = require("os");
const child_process = require("child_process");
const url = require('url');
const amqp = require("amqplib");
const { randomUUID } = require("crypto");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

// Simple health endpoint
app.get('/health', (req,res)=>res.json({status:'healthy', service:'gateway', timestamp: new Date().toISOString()}));

// AMQP setup
let amqpChannel;
// Use localhost by default when running outside docker; inside compose set env
const AMQP_URL = process.env.AMQP_URL || "amqp://localhost:5672";
const EXCHANGE = "mcp.poc";
(async () => {
  try {
    const conn = await amqp.connect(AMQP_URL);
    const ch = await conn.createChannel();
    await ch.assertExchange(EXCHANGE, "fanout", { durable: false });
    amqpChannel = ch;
    console.log(`[gateway] Connected to AMQP at ${AMQP_URL}`);
  } catch (err) {
    console.error("[gateway] Failed to connect to AMQP:", err.message);
  }
})();

// MCP ping endpoint (proxy through RabbitMQ ping/pong)
app.get('/mcp/ping', async (req, res) => {
  // if AMQP unavailable just respond inline to avoid breaking UI
  if (!amqpChannel) {
    return res.json({ status: 'degraded', ts: Date.now() });
  }

  try {
    const correlationId = randomUUID();
    const ts = Date.now();
    // create exclusive temp queue for reply
    const q = await amqpChannel.assertQueue('', { exclusive: true });
    const timeout = setTimeout(() => {
      amqpChannel.deleteQueue(q.queue).catch(() => {});
      return res.status(504).json({ error: 'timeout' });
    }, 2000);

    amqpChannel.consume(q.queue, (msg) => {
      if (!msg) return;
      try {
        const m = JSON.parse(msg.content.toString());
        if (m.type === 'pong' && m.correlationId === correlationId) {
          clearTimeout(timeout);
          res.json({ status: 'ok', ts: m.ts });
          amqpChannel.deleteQueue(q.queue).catch(() => {});
        }
      } catch {}
    }, { noAck: true });

    const payload = { type: 'ping', ts, correlationId, sender: 'gateway' };
    amqpChannel.publish(EXCHANGE, '', Buffer.from(JSON.stringify(payload)), { correlationId, replyTo: q.queue });
  } catch (err) {
    console.error('[gateway] /mcp/ping error', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

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