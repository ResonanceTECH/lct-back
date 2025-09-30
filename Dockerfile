FROM node:22-alpine AS base

WORKDIR /usr/app
COPY . .
RUN npm ci --omit=dev --ignore-scripts
RUN npm i @nestjs/cli