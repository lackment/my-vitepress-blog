import { DefaultTheme } from 'vitepress';
export const sidebar: DefaultTheme.Sidebar = {
  '/vue/': [
     // 第一部分
    {
      text: 'vue2和vue3',
      collapsed: true,
      items: [
        {
          text: 'vue的基础理解',
          link: '/vue/vue.md'
        },
      ]
    },
    // 第二部分
    {
      text: '部分拆解',
      collapsed: true,
      items: [
        {
          text: 'computed和watch',
          link: '/vue/computedAndWatch'
        },
        {
          text: 'vue的路由',
          link: '/vue/vue-router'
        },
        {
          text: 'vue的插槽',
          link: '/vue/slot'
        },
      ]
    }
  ]
};