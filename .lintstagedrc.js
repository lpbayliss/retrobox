module.exports = {
  // This will lint and format TypeScript and JavaScript files
  '**/*.(ts|tsx|js)': (filenames) => [
    `yarn lint:fix ${filenames.join(' ')}`,
    `yarn format:fix ${filenames.join(' ')}`,
  ],

  // this will Format MarkDown and JSON
  '**/*.(md|json)': (filenames) => `yarn format:fix ${filenames.join(' ')}`,
};
