export const siteConfig = {
  title: 'xuanz的博客',
  subtitle: 'CodeBardPro',
  description: '一个啥都写的个人博客',
  author: 'CodeBardPro',
  email: 'xuanz54@qq.com',
  url: 'https://xuanz54.github.io/',
  language: 'zh-CN',
  postsPerPage: 10,
  nav: [
    { label: '首页', to: '/' },
    { label: '归档', to: '/archives/' },
    { label: '分类', to: '/categories/' },
    { label: '标签', to: '/tags/' },
    { label: '关于', to: '/about/' },
    { label: '壁纸', to: 'https://haowallpaper.com/', external: true },
  ],
  effects: {
    clickHeart: true,
    /** 首页一言告示板（hitokoto） */
    broadcast: true,
  },
  features: {
    /** 文内图片点击放大 */
    lightbox: true,
    /** 文内 mermaid 图渲染 */
    mermaid: true,
    /** 文末版权声明 */
    copyright: true,
  },
  analytics: {
    /** 不蒜子站点统计（页脚 UV/PV） */
    busuanzi: true,
  },
  reward: {
    enabled: true,
    alipay: '/images/reward/alipay.jpg',
    wechat: '/images/reward/wechat.jpg',
  },
  comments: {
    /** Twikoo envId — 留空则展示占位说明 */
    twikooEnvId: '',
  },
} as const
