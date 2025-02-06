import { withPwa } from '@vite-pwa/vitepress'

import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'

import UnoCssConfig from '../unocss.config'

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
  vite: {
    plugins: [
      UnoCSS(UnoCssConfig),
    ],
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
      {
        text: 'TypeScript',
        items: [
          {
            link: '/TypeScript/base/first',
            text: '基础篇',
          },
          {
            link: '/TypeScript/advanced/first',
            text: '进阶篇',
          },
        ],
      },
      {
        text: '算法刷题录',
        items: [
          {
            link: '/algorithm/binarySearch/description',
            text: '二分算法',
          },
          {
            link: '/algorithm/recursion',
            text: '递归',
          },
        ],
      },
    ],
    sidebar: [
      {
        collapsed: false,
        text: 'JavaScript基础',
        items: [{
          link: '/JavaScript/proto',
          text: '原型链',
        }, {
          link: '/JavaScript/this',
          text: 'this相关',
        }],
      },
      {
        collapsed: false,
        text: '设计模式',
        items: [{
          link: '/DesignPartten/singleton',
          text: '单例模式',
        }, {
          link: '/DesignPartten/strategy',
          text: '策略模式',
        }, {
          link: '/DesignPartten/state',
          text: '状态模式',
        }, {
          link: '/DesignPartten/publishSubscribe',
          text: '发布订阅模式',
        }, {
          link: '/DesignPartten/proxy',
          text: '代理模式',
        }, {
          link: '/DesignPartten/mediator',
          text: '中介者模式',
        }],
      },
      {
        collapsed: false,
        text: 'TypeScript',
        items: [{
          text: '基础篇',
          items: [{
            link: '/TypeScript/base/first',
            text: '第一篇',
          }, {
            link: '/TypeScript/base/second',
            text: '第二篇',
          }],
        }, {
          text: '进阶篇',
          items: [{
            link: '/TypeScript/advanced/first',
            text: '第一篇',
          }, {
            link: '/TypeScript/advanced/second',
            text: '第二篇',
          }],
        }],
      },
      {
        collapsed: false,
        text: '算法刷题录',
        items: [{
          link: '/algorithm/base',
          text: '简介',
        }, {
          text: '二分查找',
          collapsed: true,
          items: [{
            link: '/algorithm/binarySearch/description',
            text: '算法说明',
          }, {
            link: '/algorithm/binarySearch/leetcode',
            text: 'leetcode',
          }],
        }, {
          text: '双指针',
          link: '/algorithm/twoPointers',
        }, {
          text: '递归',
          link: '/algorithm/recursion',
        }],
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
