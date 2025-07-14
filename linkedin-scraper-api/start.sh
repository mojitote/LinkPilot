#!/bin/bash

# LinkedIn Scraper API Startup Script

echo "🚀 Starting LinkedIn Scraper API..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env file from template..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Created .env file from env.example"
        echo "⚠️  Please edit .env file with your LinkedIn credentials before running again"
        echo "   Get credentials from LinkedIn browser cookies (li_at cookie)"
        exit 1
    else
        echo "❌ env.example not found. Please create .env file manually"
        exit 1
    fi
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Start the API server
echo "🌐 Starting FastAPI server..."
python main.py 