This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database

This project uses PostgreSQL. When developing locally it is recommended to use docker to run a postgres database.
Yuo can do this by running `docker run -d --name retrobox-postgres -p 5432:5432 -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=retrobox postgres` 