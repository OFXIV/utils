import { defineConfig } from "rollup";
import terser from "@rollup/plugin-terser";
export default [
    // 1️⃣ 打包成一个总文件（all-utils.js）
    {
      input: "src/index.js",
      output: [
        {
          file: "dist/all-utils.js",
          format: "umd",
          name: "Utils"
        },
        {
          file: "dist/all-utils.min.js",
          format: "umd",
          name: "Utils",
          plugins: [terser()]
        }
      ]
    },
  
    // 2️⃣ 打包每个工具独立文件
    {
      input: {
        "json-converter": "src/json-converter/index.js", // json转换工具
      },
      output: {
        dir: "dist",
        format: "umd",
        entryFileNames: "[name].js",
        name: "Utils"   // 浏览器全局变量
      },
      plugins: [terser()]
    }
  ];