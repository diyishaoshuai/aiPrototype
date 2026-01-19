import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  const apiPort = env.API_PORT || '8080'

  return {
    plugins: [vue()],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    // 环境变量配置
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __API_BASE_URL__: JSON.stringify(env.API_BASE_URL || `http://localhost:${apiPort}`)
    },
    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'terser' : false,

      // 代码分割优化
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          'short-video-app': resolve(__dirname, 'src/prototypes/short-video-app/index.html'),
          'xingqu-web': resolve(__dirname, 'src/prototypes/xingqu_web/index.html'),
          'xingqu-h5': resolve(__dirname, 'src/prototypes/xingqu_h5/index.html')
        },
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'ui-vendor': ['element-plus', 'vant']
          }
        }
      },

      // 性能优化
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false
    },
    // 开发服务器配置
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      host: true,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
          rewrite: (path) => path
        }
      }
    },

    // 预览服务器配置
    preview: {
      port: 4173,
      host: true
    }
  }
})
