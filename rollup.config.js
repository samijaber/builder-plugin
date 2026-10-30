import typescript from '@rollup/plugin-typescript';

// Builder loads plugins as SystemJS modules; these are provided by the host app.
const hostProvided = ['mobx', '@builder.io/app-context'];

export default {
  input: 'src/index.ts',
  external: hostProvided,
  output: {
    file: 'dist/plugin.system.js',
    format: 'system',
    sourcemap: true,
  },
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
};
