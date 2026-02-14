#!/bin/bash

# Script to build and test Docker container locally

set -e

echo "🧹 Cleaning up old containers and images..."
docker stop retire-right-nl-test 2>/dev/null || true
docker rm retire-right-nl-test 2>/dev/null || true

echo "🏗️  Building Docker image..."
docker build -t retire-right-nl:latest .

echo "🚀 Starting container on port 8080..."
docker run -d -p 8080:8080 --name retire-right-nl-test retire-right-nl:latest

echo "⏳ Waiting for container to start..."
sleep 5

echo "📊 Container logs:"
docker logs retire-right-nl-test

echo ""
echo "✅ Container is running!"
echo "🌐 Open http://localhost:8080 in your browser"
echo ""
echo "To stop the container, run:"
echo "  docker stop retire-right-nl-test"
echo "  docker rm retire-right-nl-test"

