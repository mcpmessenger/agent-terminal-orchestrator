FROM node:18-bullseye

# Install essential OS packages (git, compilers, python, sudo)
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    python3-pip \
    sudo \
    vim nano curl wget build-essential \
    && rm -rf /var/lib/apt/lists/*

# Enable corepack (yarn & pnpm) and install pnpm globally
RUN corepack enable

# Create non-root user with sudo privileges
RUN useradd -m -s /bin/bash -G sudo developer && \
    echo 'developer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER developer
WORKDIR /workspace

# Python virtualenv tools
RUN pip3 install --user virtualenv pipenv poetry

# Git defaults (can be overridden by user config later)
RUN git config --global user.name "Developer" && \
    git config --global user.email "developer@example.com"

# QoL shell aliases
RUN echo 'export PATH=$PATH:~/.local/bin' >> ~/.bashrc && \
    echo 'alias ll="ls -la"' >> ~/.bashrc && \
    echo 'alias la="ls -A"' >> ~/.bashrc

EXPOSE 3000 8000 8080

CMD ["/bin/bash"]
LABEL org.opencontainers.image.source="terminal-orchestrator" 