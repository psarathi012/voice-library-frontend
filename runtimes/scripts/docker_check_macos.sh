#!/bin/bash

# Refresh environment variables
# macOS typically uses /etc/profile and /etc/zprofile
if [ -f "/etc/profile" ]; then
    source /etc/profile
fi

# Source user's profile and zshrc (macOS default shell is zsh)
if [ -f "$HOME/.zprofile" ]; then
    source "$HOME/.zprofile"
fi

if [ -f "$HOME/.zshrc" ]; then
    source "$HOME/.zshrc"
fi

# Debug: Try to find docker
DOCKER_PATH=$(command -v docker)

# Check if docker command is available
if [ -z "$DOCKER_PATH" ]; then
    echo "NOT INSTALLED"
    exit 0
fi

if ! docker info &> /dev/null; then
    # On macOS, we can't use systemctl. Docker.app needs to be started manually
    echo "NOT RUNNING"
else
    echo "RUNNING"
fi
