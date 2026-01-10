#!/bin/sh

# Script para ejecutar tests en Docker

echo "Ejecutando tests con base de datos de testing..."
export DATABASE_URL="file:/data/testing/test.db"
export NODE_OPTIONS="--experimental-vm-modules"

npx jest --config jest.config.js --detectOpenHandles
