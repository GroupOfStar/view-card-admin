import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport from 'vite-plugin-style-import'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'lodash-es': ['lodash-es'],
          'ant-design-vue': ['ant-design-vue'],
          moment: ['moment'],
        },
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     return id
        //       .toString()
        //       .split('node_modules/')[1]
        //       .split('/')[0]
        //       .toString()
        //   }
        // },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  plugins: [
    vueJsx(),
    vue(), // ant-design-vue按需加载样式
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: name => {
            return `ant-design-vue/es/${name}/style/index`
          },
        },
      ],
    }),
  ],
  // ant-design-vue相关
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // additionalData: '@import "./src/App.less";', // 添加公共样式文件
        modifyVars: {
          'btn-border-radius-base': '5px',
          'btn-default-border': '#44CCB5',
          'btn-default-color': '#44CCB5',
          'menu-dark-bg': '#44CCB5',
          'menu-dark-color': '#fff',
          'menu-dark-item-active-bg': '#1a8173',
          'layout-sider-background': '#44CCB5',
          'primary-color': '#44CCB5',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
  // server: {
  //   proxy: {
  //     // 如果是 /lsbdb 打头，则访问地址如下
  //     '/xxl_job_admin': {
  //       target: 'http://10.28.127.50:8083/',
  //       toProxy: true,
  //       prependPath: true,
  //       changeOrigin: true,
  //       // rewrite: path => path.replace(/^\/lsbdb/, '')
  //     },
  //   },
  // },
})
