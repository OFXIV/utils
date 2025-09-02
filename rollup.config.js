import { defineConfig } from "rollup";
import terser from "@rollup/plugin-terser";
export default [
    {
      input: "src/index.js",
      output: [
        {
          file: "dist/all-utils.js",
          format: "umd",
          name: "OFUtils"
        },
        {
          file: "dist/all-utils.min.js",
          format: "umd",
          name: "OFUtils",
          plugins: [terser()]
        }
      ]
    },
    {
      input: 'src/json-converter/index.js',
      output: { file: 'dist/json-converter.js', format: 'umd', name: 'JsonConverter' }
    },
  ];