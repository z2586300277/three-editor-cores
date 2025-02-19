import { defineConfig } from "vite"

export default defineConfig({

  server: {

    port: 2586,

    open: true,

    host: '0.0.0.0'

  },

  build: {

    // 配置打包输出到docs目录
    outDir: 'docs',

    // 不删除目录文件
    emptyOutDir: false,

    lib: {

      entry: './lib/main.js',

      name: 'ThreeEditorCores',

      fileName: 'index'

    }

  }

})