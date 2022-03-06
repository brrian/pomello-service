import { browser } from './package.json';
import baseConfig from './rollup.config';

export default [
  {
    ...baseConfig[0],
    output: [
      {
        file: browser.replace('dist', '.tmp'),
        format: 'umd',
        name: 'createPomelloService',
        sourcemap: 'inline',
      },
    ],
    plugins: baseConfig[0].plugins.filter(({ name }) => name !== 'terser'),
  },
];
