module.exports = {
  title: 'Markdown to HTML',
  description: 'Convert Markdown to HTML',
  base: '/md/',
  head: [
    ['style', {}, `
      /* 隐藏导航栏和标题 */
      .VPNav, 
      .VPNavBar,
      .VPNavBarTitle,
      .VPLocalNav,
      .header-anchor,
      .VPHomeHero,
      .Layout > header,
      .VPSkipLink {
        display: none !important;
      }
      
      /* 移除页面顶部的空白 */
      .VPContent {
        padding-top: 0 !important;
      }
      
      /* 调整内容区域样式 */
      .VPDoc .container {
        max-width: 90% !important;
        padding: 20px !important;
      }
      
      /* 隐藏标题 */
      .vp-doc h1:first-child {
        display: none !important;
      }
      
      /* 覆盖任何固定定位 */
      .fixed {
        position: static !important;
      }
      
      /* 移除页脚 */
      .VPDocFooter {
        display: none !important;
      }
    `]
  ],
  themeConfig: {
    nav: false,
    sidebar: false,
    footer: false,
    docFooter: false,
    outline: false,
    outlineTitle: false,
    lastUpdated: false,
    socialLinks: false,
    search: false,
    darkMode: false,
    aside: false,
    asideLevels: 0
  }
} 