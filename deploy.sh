#!/bin/bash

# Define variables
REPO_DIR="$(pwd)"  # The repository directory is the current working directory
DOCKER_COMPOSE_FILE="docker-compose.yaml"
LOG_FILE="deploy.log"

# Function to log messages
log() {
    echo "[$(date)] $1" | tee -a "$LOG_FILE"
}

# Navigate to the repository directory
cd "$REPO_DIR" || { log "Error: Repository directory not found."; exit 1; }

# Pull the latest changes from the main branch
log "Pulling latest code from the repository..."
git reset --hard  # Reset any local changes
git clean -fd  # Remove untracked files and directories
git pull origin main || { log "Error: Failed to pull the latest code."; exit 1; }

# Stop and remove existing containers and project-specific images
log "Stopping and removing existing containers and images for the project..."
docker-compose down --rmi all || { log "Error: Failed to stop and remove containers and images."; exit 1; }

# Build and start the containers using Docker Compose
log "Building and starting containers..."
docker-compose -f "$DOCKER_COMPOSE_FILE" up --build -d || { log "Error: Failed to build and start containers."; exit 1; }

log "Deployment completed successfully!"
