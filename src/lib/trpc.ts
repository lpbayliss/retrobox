import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { createTRPCNext } from '@trpc/next';
import type { inferProcedureOutput } from '@trpc/server';
import superjson from 'superjson';

import type { AppRouter } from '../server/routers/_app';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.APP_URL) return `https://${process.env.APP_URL}`;
  return `http://localhost:3000`;
}

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    // https://github.com/KATT/unidici-fetch-reserved-header-crap/pull/1
    // Node 18 doesn't like all headers and gets mad.
    let headers = ctx?.req?.headers;
    delete headers?.connection;

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (ctx?.req) return { ...ctx.req.headers, 'x-ssr': '1' };
            return {};
          },
        }),
      ],
      transformer: superjson,
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  ssr: true,
});

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<TRouteKey extends keyof AppRouter['_def']['queries']> =
  inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;
