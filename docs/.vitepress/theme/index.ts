import BlogTheme from "@sugarat/theme";
import Layout from "./components/layout.vue";
import vitepressMusic from "music-lackment-plugin-vitepress";
import "music-lackment-plugin-vitepress/lib/css/index.css";

// 自定义样式重载
import "./style.scss";

// 自定义主题色
// import './user-theme.css'

const playlist = [
  {
    name: "木兰行",
    author: "忘川风华录,苍穹",
    file: "http://music.163.com/song/media/outer/url?id=1436879629.mp3",
  },
];
export default {
  extends: BlogTheme,
  Layout: Layout as unknown as string,
  enhanceApp: (ctx) => {
    vitepressMusic(playlist);
  },
};
