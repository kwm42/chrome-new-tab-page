import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * 自定义插件：配置 HTML 中脚本的加载方式
 * 使用 Vite 官方的 transformIndexHtml 钩子
 */
function chromeExtensionPlugin(): Plugin {
  return {
    name: 'chrome-extension-plugin',
    transformIndexHtml(html) {
      // 移除 type="module" 避免 CORS 问题
      // 添加 defer 确保 DOM 加载完成
      // 移除 crossorigin 属性（可选，在扩展中不需要）
      return html
        .replace(/type="module"\s+crossorigin/g, 'defer')
        .replace(/\s+crossorigin/g, '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Ensure built asset URLs stay relative for extension/new tab usage
  base: './',
  build: {
    // Disable module preload polyfill for Chrome extension compatibility
    modulePreload: false,
    rollupOptions: {
      output: {
        // Use IIFE format and inline dynamic imports to avoid CORS
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    chromeExtensionPlugin(),
  ],
})
