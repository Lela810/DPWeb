FROM node:18-bullseye-slim AS deps
WORKDIR /app

# Install dependencies (use npm install to work without package-lock.json)
COPY package.json package-lock.json* ./
RUN npm install --no-audit --prefer-offline

FROM deps AS build
WORKDIR /app
# Copy source into build stage
COPY . .

# Run build script which should run `prisma generate` and asset build
# NOTE: set `NODE_TLS_REJECT_UNAUTHORIZED=0` here to avoid failures when
# downloading Prisma binaries behind a proxy / self-signed cert in CI/docker.
# This is a temporary development workaround — prefer adding the proxy/CA
# certs to the image or configuring npm/openssl properly for production.
RUN NODE_TLS_REJECT_UNAUTHORIZED=0 npm run build

FROM node:18-bullseye-slim AS prod
WORKDIR /app
ENV NODE_ENV=production

# Copy production node_modules from build stage (includes generated Prisma client)
COPY --from=build /app/node_modules ./node_modules
# Ensure generated Prisma artifacts are present (safety copy)
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application
COPY --from=build /app/dist ./dist
COPY package.json ./package.json

EXPOSE 3000

CMD ["node", "./dist/index.js"]