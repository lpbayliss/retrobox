import theme from '../src/theme/theme.ts';
import { reactIntl } from './reactIntl.js';

console.log(reactIntl.messages.length);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  chakra: {
    theme,
  },
  reactIntl,
  locale: reactIntl.defaultLocale,
  locales: {
    'en-AU': 'English',
  },
};
