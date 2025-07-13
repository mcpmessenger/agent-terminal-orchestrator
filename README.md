# Agent Terminal Orchestrator

A web UI for spinning up multiple interactive terminals (PowerShell, CMD, WSL bash, or a throw-away Docker Ubuntu shell) inside your browser and routing them through WebSockets.

## Tech stack

• Vite + React + TypeScript  
• Tailwind CSS with shadcn-ui components  
• `xterm.js` for terminal emulation  
• Node/Express WebSocket gateway (fallbacks to `child_process` if `node-pty` isn't installed)  

## Quick start

```bash
# install deps
npm i

# ① back-end PTY gateway (port 8080)
npm run server

# ② front-end dev server (port 5173)
npm run dev
```
Open `http://localhost:5173` and click **New Terminal**.

## Runtime options

When you create a terminal you can choose the underlying shell:

| Option          | Notes |
|-----------------|-------|
| PowerShell      | default on Windows |
| CMD             | legacy Windows shell |
| WSL bash        | requires `wsl.exe` (→ `wsl --install`) |
| Docker Ubuntu   | runs `docker run --rm -it -v $PWD:/workspace ubuntu bash` (Docker Desktop must be running) |

The selection is sent as `ws://localhost:8080/pty?shell=<runtime>`.

## Production build

```bash
npm run build     # static assets in dist/
```

Serve the `dist` folder with your favourite reverse proxy (nginx, Caddy, etc.) and keep `npm run server` running behind the same host.

## Customisation

* **Dark/light theme** – click the sun / moon icon in the navbar.  
* **Close a terminal** – use the × in the card header.  
* **Grid** – responsive 2 columns; automatically grows downwards.

---
### Troubleshooting

• `node-pty couldn't be loaded` – you can ignore on Windows; the gateway falls back to `child_process.spawn`.  Install `node-pty` after Visual Studio C++ build tools for full PTY support.

• WSL option not working → make sure `wsl --status` prints details.

• Docker Ubuntu says `docker command not found` → install Docker Desktop and ensure it's in PATH.
