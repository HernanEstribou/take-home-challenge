# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=18.20.7

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /app

# Crear directorios para las bases de datos
RUN mkdir -p /data/production /data/testing

COPY package*.json ./
RUN npm install --include=dev
COPY . .

EXPOSE 5173

# Script de inicio: generar cliente de Prisma e iniciar la app
CMD npx prisma generate && npm run start
