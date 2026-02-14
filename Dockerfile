# 1. Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
# COPY only package.json first to avoid error if lockfile is missing
COPY package.json ./ 
RUN npm install

# 2. Build the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Fix: Use = for ENV variables to remove warnings
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Production runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static files - these need to be in the right location
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create public directory (Next.js may need it even if empty)
RUN mkdir -p ./public && chown nextjs:nodejs ./public

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
