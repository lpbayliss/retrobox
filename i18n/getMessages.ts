import enAU from './locales/en-AU.json';

export const getMessages = (locale: string) => {
  switch (locale) {
    case 'en-AU':
      return enAU;
    default:
      return enAU;
  }
};
