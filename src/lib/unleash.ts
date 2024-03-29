import { IConfig, InMemoryStorageProvider, IToggle, UnleashClient } from 'unleash-proxy-client';

export const config: IConfig = {
  url: process.env.NEXT_PUBLIC_UNLEASH_PROXY_URL || 'http://localhost:5000/proxy',
  clientKey: process.env.NEXT_PUBLIC_UNLEASH_CLIENT_KEY || 'development-proxy',
  refreshInterval: parseInt(process.env.NEXT_PUBLIC_UNLEASH_REFRESH_INTERVAL || '15'),
  appName: process.env.NEXT_PUBLIC_UNLEASH_APP_NAME || 'retrobox-development',
  environment: process.env.NEXT_PUBLIC_UNLEASH_ENVIRONMENT || 'development',
};

export type ToggleProp = { toggles: IToggle[] };

export const getPrefetchClient = () => {
  return new UnleashClient({
    ...config,
    fetch,
    storageProvider: new InMemoryStorageProvider(),
    disableMetrics: true,
    disableRefresh: true,
  });
};

export const getAppClient = (toggles: IToggle[]) => {
  return new UnleashClient({
    ...config,
    ...(typeof window !== 'undefined'
      ? {}
      : { fetch: fetch, storageProvider: new InMemoryStorageProvider() }),
    bootstrap: toggles,
  });
};
