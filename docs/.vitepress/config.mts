import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'
import { nav, sidebar } from './relaConfig'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: blogTheme,
  base: '/my-vitepress-blog/',
  lang: 'zh-cn',
  title: 'LackMent',
  description: 'LackMent博客主题，基于 vitepress 实现',
  lastUpdated: true,
  // 详见：https://vitepress.dev/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    ['link', { rel: 'icon', href: '/my-vitepress-blog/favicon.ico' }]
  ],
  themeConfig: {
    lastUpdatedText: '上次更新于',
    logo: '/logo.png',
    search: {
      provider: 'local'
    },
    editLink: {
      pattern:
        'https://github.com/lackment/my-vitepress-blog/tree/master/docs/:path',
      text: '去 GitHub 上编辑内容'
    },
    nav,
    outline: {
      level: [2, 6],
      label: '目录',
    },
    sidebar,
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/lackment'
      }
    ]
  }
})
