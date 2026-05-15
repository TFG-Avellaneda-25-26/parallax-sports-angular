# syntax=docker/dockerfile:1.7

# ──────────────────────────────────────────────
# Stage 1 — build
# Produces a hashed, AOT-compiled, tree-shaken bundle under dist/temp-name/browser
# ──────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps first so the layer cache stays warm across source-only changes.
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund --prefer-offline

# Copy the rest of the project and build the production bundle.
# defaultConfiguration in angular.json is "production" → optimization + AOT + hashing on.
COPY . .
RUN npx ng build

# ──────────────────────────────────────────────
# Stage 2 — runtime
# Tiny nginx serving the static bundle. SPA fallback + correct caching headers.
# ──────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Replace default nginx site with our SPA config.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Project name in angular.json is "parallax-sports" → dist/parallax-sports/browser/
COPY --from=builder /app/dist/parallax-sports/browser /usr/share/nginx/html

# Healthcheck target served by nginx (see nginx.conf).
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://localhost/health || exit 1

EXPOSE 80
