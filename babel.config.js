module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ios.tsx',
            '.android.tsx',
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.json',
          ],
          alias: {
            '@assets': './assets',
            '~': './src',
          },
        },
      ],
      ['babel-plugin-styled-components'],
    ],
  };
};
