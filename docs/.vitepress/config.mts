import { withPwa } from '@vite-pwa/vitepress'

import { defineConfig } from 'vitepress'

import { search as zhSearch } from './zh.mjs'

// https://vitepress.dev/reference/site-config
export default withPwa(defineConfig({
  title: 'Kona Blog',
  description: 'Learning knows no bounds',
  srcDir: 'src',
  ignoreDeadLinks: true,
  head: [
    ['link', { href: '/favicon.ico', rel: 'icon', type: 'image/svg+xml' }],
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
    search: {
      options: {
        locales: {
          ...zhSearch,
        },
      },
      provider: 'local',
    },
    nav: [
      {
        text: 'JavaScript基础',
        items: [
          {
            link: '/JavaScript/proto',
            text: '原型链',
          },
          {
            link: '/JavaScript/this',
            text: 'this相关',
          },
        ],
      },
      {
        text: '前端工程化',
        items: [
          {
            link: '/engineer/webpack',
            text: 'webpack',
          },
          {
            link: '/engineer/rollup',
            text: 'rollup',
          },
          {
            link: '/engineer/vite',
            text: 'vite',
          },
        ],
      },
    ],
    sidebar: [
      {
        collapsed: false,
        text: 'JavaScript基础',
        items: [
          {
            link: '/JavaScript/proto',
            text: '原型链',
          },
          {
            link: '/JavaScript/this',
            text: 'this相关',
          },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
    docFooter: {
      next: '下一页',
      prev: '上一页',
    },
    outline: {
      label: '页面导航',
    },
    returnToTopLabel: '回到顶部',
    lightModeSwitchTitle: '切换为浅色主题',
    darkModeSwitchTitle: '切换为深色主题',
  },
}))
