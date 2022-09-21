const locales = ['en-AU'];

const messages = locales.reduce(
  (acc, lang) => ({
    ...acc,
    [lang]: require(`../src/i18n/locales/${lang}.json`), // whatever the relative path to your messages json is
  }),
  {},
);

const formats = {}; // optional, if you have any formats

export const reactIntl = {
  defaultLocale: 'en-AU',
  locales,
  messages,
  formats,
};
