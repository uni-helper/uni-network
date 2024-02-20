import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Uni Network',
  description: '为 uni-app 打造的基于 Promise 的 HTTP 客户端。',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh-cn' }],
    ['meta', { name: 'og:site_name', content: 'Uni Network' }],
    [
      'meta',
      {
        name: 'og:image',
        content:
          'https://github.com/uni-helper/website/raw/main/.github/assets/uni-helper-banner.png',
      },
    ],
  ],
  themeConfig: {
    logo: { src: '/logo.png', width: 24, height: 24 },
    nav: [
      { text: '指南', link: '/guide/introduction' },
      {
        text: '更新日志',
        link: 'https://github.com/uni-helper/uni-network/tree/main/CHANGELOG.md',
      },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/guide/introduction' },
          { text: '起步', link: '/guide/installation' },
          { text: '基本用例', link: '/guide/example' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'API', link: '/api/introduction' },
          { text: '实例', link: '/api/instance' },
          { text: '请求配置', link: '/api/request-config' },
          { text: '响应结构', link: '/api/response-schema' },
          { text: '默认配置', link: '/api/config-defaults' },
        ],
      },
      {
        text: '进阶',
        items: [
          { text: '拦截器', link: '/advanced/interceptors' },
          { text: '错误处理', link: '/advanced/handling-errors' },
          { text: '取消请求', link: '/advanced/cancellation' },
          { text: 'TypeScript 支持', link: '/advanced/typescript-support' },
          { text: '高级功能', link: '/advanced/enhancements' },
          { text: '组合式函数', link: '/advanced/composition-api' },
        ],
      },
      {
        text: '其它',
        items: [
          { text: '构建与环境支持', link: '/other/build' },
          { text: '比较', link: '/other/comparison' },
          { text: '致谢', link: '/other/thank' },
        ],
      },
    ],
    editLink: {
      pattern: 'https://github.com/uni-helper/uni-network/edit/main/docs/:path',
    },
    lastUpdated: {},
    socialLinks: [
      { icon: 'github', link: 'https://github.com/uni-helper/uni-network' },
    ],
    search: {
      provider: 'local',
    },
  },
});
