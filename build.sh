#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting build process..."

# Install dependencies in root (for build tools)
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "🔧 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies and build
echo "⚛️ Installing client dependencies..."
cd client

# Install all dependencies including devDependencies (needed for vite)
npm install --include=dev

echo "🏗️ Building React client..."
# Use npm run build to ensure proper environment
npm run build

# Verify build was successful
if [ ! -d "dist" ]; then
    echo "❌ Client build failed - dist directory not found"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ Client build failed - index.html not found"
    exit 1
fi

echo "✅ Client build successful"

# Copy built files to server's public directory
echo "📁 Copying built files to server..."
cd ..
mkdir -p server/public
cp -r client/dist/* server/public/

# Verify copy was successful
if [ ! -f "server/public/index.html" ]; then
    echo "❌ File copy failed - index.html not found in server/public"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📋 Files in server/public:"
ls -la server/public/
