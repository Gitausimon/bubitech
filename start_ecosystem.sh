#!/bin/bash
echo "🚀 Booting Bubi Tech Ecosystem..."

# Start Mobile Specs Microservice (Port 4000)
(cd mobile-specs-api && npm install --no-audit --no-fund && npm run dev) &

# Start Backend Server (Port 5000)
(cd backend && npm run dev || node server.js) &

# Start Frontend Vite (Port 5173)
(cd frontend && npm run dev) &

echo "✅ All services booted. Waiting for output..."
wait
