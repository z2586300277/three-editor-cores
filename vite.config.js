import { defineConfig } from "vite"

export default defineConfig({

  server: {

    port: 2586,

    open: true,

    host: '0.0.0.0'

  },

  build: {

    lib: {

      entry: './lib/main.js',

      name: 'ThreeEditorCores',

      fileName: 'index'

    }

  }

})