# Claude Code Sandbox for Visual Chad Loop
# Provides isolated environment with only this project accessible

FROM node:20-slim

# Install useful tools
RUN apt-get update && apt-get install -y \
    git curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code globally
RUN npm install -g @anthropic-ai/claude-code

# Install Playwright and ALL its system dependencies (as root)
RUN npx playwright install --with-deps chromium

# Create 'claude-sup' alias for --dangerously-skip-permissions
RUN echo '#!/bin/sh\nclaude --dangerously-skip-permissions "$@"' > /usr/local/bin/claude-sup \
    && chmod +x /usr/local/bin/claude-sup

# Use existing node user (UID 1000) - matches most Linux host users
# Create .claude and .local/bin directories for the node user
RUN mkdir -p /home/node/.claude /home/node/.local/bin && chown -R node:node /home/node

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Give node user ownership of /app and Playwright cache
RUN chown -R node:node /app /root/.cache 2>/dev/null || true

# Switch to non-root user
USER node

# Add ~/.local/bin to PATH
ENV PATH="/home/node/.local/bin:$PATH"

# Copy Playwright browsers to node user's cache (from root's install)
RUN mkdir -p /home/node/.cache && \
    cp -r /root/.cache/ms-playwright /home/node/.cache/ 2>/dev/null || \
    npx playwright install chromium

# Default command
CMD ["claude-sup"]
