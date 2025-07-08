#!/bin/bash

# Install server dependencies
cd server
npm install

# Install client dependencies and build
cd ../client
npm install
npm run build

# Copy built files to server's public directory
cd ..
mkdir -p server/public
cp -r client/dist/* server/public/

echo "Build completed successfully!"
