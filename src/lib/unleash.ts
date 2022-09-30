import { IConfig, InMemoryStorageProvider, IToggle, UnleashClient } from 'unleash-proxy-client';
import { SessionProp } from './auth';
import { publicRuntimeConfig } from './publicRuntimeConfig';

export const config: IConfig = {
  url: publicRuntimeConfig.UNLEASH_PROXY_URL,
  clientKey: publicRuntimeConfig.UNLEASH_CLIENT_KEY,
  refreshInterval: publicRuntimeConfig.UNLEASH_REFRESH_INTERVAL,
  appName: publicRuntimeConfig.UNLEASH_APP_NAME,
  environment: publicRuntimeConfig.UNLEASH_ENVIRONMENT,
};

export type ToggleProp = { toggles: IToggle[] };

export const getPrefetchClient = () =>
  new UnleashClient({
    ...config,
    fetch,
    storageProvider: new InMemoryStorageProvider(),
    disableMetrics: true,
    disableRefresh: true,
  });

export const getAppClient = (toggles: IToggle[]) =>
  new UnleashClient({
    ...config,
    ...(typeof window !== 'undefined'
      ? {}
      : { fetch: fetch, storageProvider: new InMemoryStorageProvider() }),
    bootstrap: toggles,
  });

export const withToggles = async <P extends { [key: string]: any } & SessionProp>(
  props: P,
): Promise<P & ToggleProp> => {
  const unleash = getPrefetchClient();

  if (props.session) unleash.updateContext({ userId: props.session?.user.id });

  await unleash.start();
  const toggles = unleash.getAllToggles();

  return { ...props, toggles };
};
