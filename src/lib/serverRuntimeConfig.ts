import type * as config from '../../next.config';
import getConfig from 'next/config';

/**
 * Inferred type from `serverRuntime` in `next.config.js`
 */
type ServerRuntimeConfig = typeof config.serverRuntimeConfig;

const nextConfig = getConfig();

export const serverRuntimeConfig = nextConfig.serverRuntimeConfig as ServerRuntimeConfig;
