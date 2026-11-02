# Build
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @servicedesk/shared build
RUN pnpm --filter @servicedesk/api prisma generate
RUN pnpm --filter @servicedesk/api build

# Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared/dist ./packages/shared/dist
COPY apps/api/package.json ./apps/api/
COPY apps/api/dist ./apps/api/dist
COPY apps/api/prisma ./apps/api/prisma
RUN pnpm install --prod --frozen-lockfile
EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
