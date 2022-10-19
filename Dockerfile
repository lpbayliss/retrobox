# Install dependencies only when needed
FROM node:19-alpine3.15 AS deps
ARG FONTAWESOME_NPM_AUTH_TOKEN
ENV FONTAWESOME_NPM_AUTH_TOKEN ${FONTAWESOME_NPM_AUTH_TOKEN}

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc ./
COPY ./db ./db
RUN \
    if [ -f yarn.lock ]; then yarn --ignore-engines --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi


# Rebuild the source code only when needed
FROM node:19-alpine3.15 AS builder
ARG APP_ENV
ENV APP_ENV ${APP_ENV}

RUN echo $APP_ENV

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY env/.env.${APP_ENV} .env

RUN yarn build

# Production image, copy all the files and run next
FROM node:19-alpine3.15 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/db ./db

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]