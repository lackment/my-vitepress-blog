import BlogTheme from '@sugarat/theme'
import Layout from './components/layout.vue'

// 自定义样式重载
import './style.scss'

// 自定义主题色
// import './user-theme.css'

export default {
  extends: BlogTheme,
  Layout: Layout as unknown as string
}
