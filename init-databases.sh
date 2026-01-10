#!/bin/sh

# Script para inicializar las bases de datos de producción y testing

echo "Inicializando base de datos de producción..."
export DATABASE_URL="file:/data/production/prod.db"
npx prisma migrate deploy

echo "Inicializando base de datos de testing..."
export DATABASE_URL="file:/data/testing/test.db"
npx prisma migrate deploy

echo "Bases de datos inicializadas correctamente"
