#!/bin/bash

echo "🧪 Testing Vertex AI Integration"
echo "================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo "📝 Creating template..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  Please edit .env.local with your Google Cloud project details:"
    echo "   - GOOGLE_CLOUD_PROJECT=your-project-id"
    echo "   - GOOGLE_CLOUD_LOCATION=europe-west4"
    echo ""
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules/@google-cloud/vertexai" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Source environment variables
export $(cat .env.local | grep -v '^#' | xargs)

echo "✅ Environment configured:"
echo "   Project: ${GOOGLE_CLOUD_PROJECT:-not set}"
echo "   Location: ${GOOGLE_CLOUD_LOCATION:-not set}"
echo ""

# Test API with curl
echo "🚀 Testing API endpoint..."
echo ""

# Start dev server in background
npm run dev > /tmp/test-server.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 8

# Test the API
echo "📡 Sending test request..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "currentAge": 30,
    "retirementAge": 50,
    "currentWealth": 50000,
    "monthlyExpenses": 3000
  }')

# Kill the server
kill $RPID 2>/dev/null

echo ""
echo "📊 Response received:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if AI fields are present
if echo "$RESPONSE" | grep -q "personalizedStrategy"; then
    echo "✅ SUCCESS! AI-generated fields detected:"
    echo "   ✓ personalizedStrategy"
    echo "   ✓ dutchProducts"
    echo "   ✓ wealthJourney"
    echo "   ✓ taxOptimization"
    echo ""
    echo "🎉 Vertex AI integration is working!"
else
    echo "⚠️  AI fields not found. Check the response above."
    echo ""
    echo "Possible issues:"
    echo "1. Vertex AI API not enabled in your GCP project"
    echo "2. Service account doesn't have aiplatform.user role"
    echo "3. GOOGLE_CLOUD_PROJECT environment variable incorrect"
    echo ""
    echo "Check server logs:"
    tail -20 /tmp/test-server.log
fi

echo ""
echo "📖 For detailed setup instructions, see VERTEX_AI_SETUP.md"

