import express from 'express';
import Docker from 'dockerode';
import { randomUUID } from 'crypto';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'runtime-manager' });
});

// Spawn container for runtime
app.post('/spawn', async (req, res) => {
  const { runtime = 'nodejs', terminalId } = req.body || {};
  if (!terminalId) return res.status(400).json({ error: 'terminalId required' });
  try {
    const image = runtime === 'python' ? 'runtime-python:latest' : 'runtime-nodejs:latest';
    const containerName = `term-${terminalId}`;
    const container = await docker.createContainer({
      Image: image,
      name: containerName,
      Tty: true,
      Cmd: ['/bin/bash'],
    });
    await container.start();
    return res.json({ containerId: container.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`runtime-manager listening on ${PORT}`)); 