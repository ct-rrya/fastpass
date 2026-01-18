#!/bin/bash
set -e

echo "Running database migration..."
npx prisma migrate deploy

echo "Starting server..."
node server/index-prisma.js
