import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { browser, main, module } from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: browser,
        format: 'umd',
        name: 'createPomelloService',
      },
      {
        file: main,
        format: 'cjs',
        exports: 'auto',
      },
      {
        file: module,
        format: 'es',
      },
    ],
    plugins: [
      resolve(),
      typescript(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
  },
];
