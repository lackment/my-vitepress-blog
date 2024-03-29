import {render, createVNode} from 'vue'
import MusicCom from './template.vue'
interface SongInfo {
  name: string;
  author: string;
  file: string;
  mins?: string;
  hide?: boolean;
}

const vitepressMusic = (list: SongInfo[] = []) => {
  if (typeof window === 'undefined') return

  const body = document.getElementsByTagName('body')[0]
  const vnode = createVNode(MusicCom, {
    list,
  })
  const boxEl = document.createElement('div')
  render(vnode, boxEl)
  document.body.appendChild(boxEl)
}

export default vitepressMusic
