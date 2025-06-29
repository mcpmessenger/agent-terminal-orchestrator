FROM node:18-bullseye
# Enable yarn & pnpm globally as root before dropping privileges
RUN corepack enable && corepack prepare pnpm@9.1.1 --activate

# non-root user
RUN useradd -m -s /bin/bash developer && echo 'developer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER developer
WORKDIR /workspace
CMD ["bash"] 