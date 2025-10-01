FROM node:22-alpine AS base

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
RUN npm install @nestjs/cli
COPY . .
RUN rm -rf dist
RUN npm run build
