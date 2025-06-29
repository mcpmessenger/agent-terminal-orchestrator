FROM python:3.11-slim
RUN apt-get update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/*
# non-root user
RUN useradd -m -s /bin/bash developer && echo 'developer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER developer
WORKDIR /workspace
RUN pip install --user pipenv poetry
CMD ["bash"] 