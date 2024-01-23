import { DefaultTheme } from 'vitepress';
export const nav: DefaultTheme.NavItem[] = [
  {
    text: '前端开发',
    items: [
      {
        text: 'vue详解',
        link: '/vue/vue.md' // 对应docs/vue下的idnex.md文件
      },
      {
        text: '有趣的技术尝试',
        link: '/interestingTechnologies/technologies.md' 
      }
    ]
  },
];
