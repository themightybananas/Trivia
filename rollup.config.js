import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // extract component CSS into a separate file (better for performance)
      css: css => {
        css.write('public/build/bundle.css');
      }
    }),

    // If you have external dependencies installed from npm, you'll most likely need these plugins:
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    // In dev mode, call `npm run start` once the bundle has been generated
    !production && livereload('public'),

    // If we're building for production (npm run build instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
