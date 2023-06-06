# aios.bot.flow

From AI prompts to online APIs.

## Deploy requirements

+ Nodejs.
+ Redis & PostgreSQL
  + (Support for MySQL/MariaDB planned.)

This repo uses Prisma for ORM; one shall push the schema to your db first with `npx prisma db push` or add it in the build process.

## Developing

```bash
pnpm install
pnpm run dev
```

## Building

```bash
pnpm run build
```

## Config

``` ini
# Email sender. Used for sending login OTP.
SMTP_SERVER=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=

# Redis. Used for maintaining login OTP & session.
REDIS_URL=

# PostgreSQL. Used for storing the config for bots.
POSTGRES_DATABASE_URL=
```
