import resolve from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
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
      typescript({
        tsconfig: './tsconfig.json',
      }),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [
      dts(),
      del({
        targets: 'dist/types',
        hook: 'buildEnd',
      }),
    ],
  },
];
