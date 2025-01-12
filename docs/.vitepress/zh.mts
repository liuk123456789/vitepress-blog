import type { DefaultTheme } from 'vitepress'

import { defineConfig } from 'vitepress'

export const zh = defineConfig({
  description: 'Kona Blog',
  lang: 'zh-Hans',
  themeConfig: {
    docFooter: {
      next: '下一页',
      prev: '上一页',
    },
    editLink: {
      pattern:
        'https://github.com/liuk123456789/vitepress-blog/blob/master/docs/src/:path',
      text: '在 GitHub 上编辑此页面',
    },
    outline: {
      label: '页面导航',
    },
    returnToTopLabel: '回到顶部',
    sidebar: {
      '/commercial/': { base: '/commercial/', items: sidebarCommercial() },
      '/components/': { base: '/components/', items: sidebarComponents() },
      '/guide/': { base: '/guide/', items: sidebarGuide() },
    },
    sidebarMenuLabel: '菜单',
  },
})

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      collapsed: false,
      text: '简介',
      items: [
        {
          link: 'introduction/vben',
          text: '关于 Vben Admin',
        },
        {
          link: 'introduction/why',
          text: '为什么选择我们?',
        },
        { link: 'introduction/quick-start', text: '快速开始' },
        { link: 'introduction/thin', text: '精简版本' },
        {
          base: '/',
          link: 'components/introduction',
          text: '组件文档',
        },
      ],
    },
    {
      text: '基础',
      items: [
        { link: 'essentials/concept', text: '基础概念' },
        { link: 'essentials/development', text: '本地开发' },
        { link: 'essentials/route', text: '路由和菜单' },
        { link: 'essentials/settings', text: '配置' },
        { link: 'essentials/icons', text: '图标' },
        { link: 'essentials/styles', text: '样式' },
        { link: 'essentials/external-module', text: '外部模块' },
        { link: 'essentials/build', text: '构建与部署' },
        { link: 'essentials/server', text: '服务端交互与数据Mock' },
      ],
    },
    {
      text: '深入',
      items: [
        { link: 'in-depth/login', text: '登录' },
        // { link: 'in-depth/layout', text: '布局' },
        { link: 'in-depth/theme', text: '主题' },
        { link: 'in-depth/access', text: '权限' },
        { link: 'in-depth/locale', text: '国际化' },
        { link: 'in-depth/features', text: '常用功能' },
        { link: 'in-depth/check-updates', text: '检查更新' },
        { link: 'in-depth/loading', text: '全局loading' },
        { link: 'in-depth/ui-framework', text: '组件库切换' },
      ],
    },
    {
      text: '工程',
      items: [
        { link: 'project/standard', text: '规范' },
        { link: 'project/cli', text: 'CLI' },
        { link: 'project/dir', text: '目录说明' },
        { link: 'project/test', text: '单元测试' },
        { link: 'project/tailwindcss', text: 'Tailwind CSS' },
        { link: 'project/changeset', text: 'Changeset' },
        { link: 'project/vite', text: 'Vite Config' },
      ],
    },
    {
      text: '其他',
      items: [
        { link: 'other/project-update', text: '项目更新' },
        { link: 'other/remove-code', text: '移除代码' },
        { link: 'other/faq', text: '常见问题' },
      ],
    },
  ]
}

function sidebarCommercial(): DefaultTheme.SidebarItem[] {
  return [
    {
      link: 'community',
      text: '交流群',
    },
    {
      link: 'technical-support',
      text: '技术支持',
    },
    {
      link: 'customized',
      text: '定制开发',
    },
  ]
}

function sidebarComponents(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '组件',
      items: [
        {
          link: 'introduction',
          text: '介绍',
        },
      ],
    },
    {
      collapsed: false,
      text: '布局组件',
      items: [
        {
          link: 'layout-ui/page',
          text: 'Page 页面',
        },
      ],
    },
    {
      collapsed: false,
      text: '通用组件',
      items: [
        {
          link: 'common-ui/vben-api-component',
          text: 'ApiComponent Api组件包装器',
        },
        {
          link: 'common-ui/vben-modal',
          text: 'Modal 模态框',
        },
        {
          link: 'common-ui/vben-drawer',
          text: 'Drawer 抽屉',
        },
        {
          link: 'common-ui/vben-form',
          text: 'Form 表单',
        },
        {
          link: 'common-ui/vben-vxe-table',
          text: 'Vxe Table 表格',
        },
        {
          link: 'common-ui/vben-count-to-animator',
          text: 'CountToAnimator 数字动画',
        },
        {
          link: 'common-ui/vben-ellipsis-text',
          text: 'EllipsisText 省略文本',
        },
      ],
    },
  ]
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  root: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonAriaLabel: '搜索文档',
        buttonText: '搜索文档',
      },
      modal: {
        errorScreen: {
          helpText: '你可能需要检查你的网络连接',
          titleText: '无法获取结果',
        },
        footer: {
          closeText: '关闭',
          navigateText: '切换',
          searchByText: '搜索提供者',
          selectText: '选择',
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          reportMissingResultsLinkText: '点击反馈',
          reportMissingResultsText: '你认为该查询应该有结果？',
          suggestedQueryText: '你可以尝试查询',
        },
        searchBox: {
          cancelButtonAriaLabel: '取消',
          cancelButtonText: '取消',
          resetButtonAriaLabel: '清除查询条件',
          resetButtonTitle: '清除查询条件',
        },
        startScreen: {
          favoriteSearchesTitle: '收藏',
          noRecentSearchesText: '没有搜索历史',
          recentSearchesTitle: '搜索历史',
          removeFavoriteSearchButtonTitle: '从收藏中移除',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          saveRecentSearchButtonTitle: '保存至搜索历史',
        },
      },
    },
  },
}
