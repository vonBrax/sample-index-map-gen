import multiEntry from "@rollup/plugin-multi-entry";
import { globSync } from 'glob';
import del from 'rollup-plugin-delete'

const sources = globSync('src/**/*.js');
const distSources = sources.map(source => source.replace(/^src\//, 'dist/'));

export default [
  {
    input: sources,
    output: {
      dir: "dist",
      sourcemap: true,
    },

    plugins: [
      del({ targets: 'dist/*'})
    ]
  },
  {
    input: distSources,
    output: {
      dir: "dist",
      sourcemap: true,
    },

    plugins: [
      // Bundles all input file to bundle.js
      multiEntry({ entryFileName: "bundle.js",   }),
    ],
  },
];
