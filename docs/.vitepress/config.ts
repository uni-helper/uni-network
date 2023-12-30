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
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/uni-helper/uni-network' }],
  },
});
