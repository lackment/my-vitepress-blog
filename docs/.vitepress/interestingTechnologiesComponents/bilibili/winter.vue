<script setup>
import { ref } from 'vue'
const winter = ref()

// 容器鼠标移动事件
let startPoint = 0

const winterMouseEnter = (e) => {
  startPoint = e.clientX - winter.value.getBoundingClientRect().left
  winter.value.classList.add('moving')
}
const winterMouseLeave = (e) => {
  winter.value.classList.remove('moving')
  winter.value.style.setProperty('--percentage', 0.5)
}
const winterMouseMove = (e) => {
    // 容器宽度足够大的时候 不需要保留2为小数
  let percentage = (
    (e.clientX - winter.value.getBoundingClientRect().left - startPoint) /
      winter.value.offsetWidth +
    0.5
  ).toFixed(2)
  winter.value.style.setProperty('--percentage', percentage)
}
</script>

<template>
  <div
    class="winter-wrap"
    ref="winter"
    @mousemove="winterMouseMove"
    @mouseenter="winterMouseEnter"
    @mouseout="winterMouseLeave"
  >
    <div class="view">
      <img
        src="https://assets.codepen.io/2002878/bilibili-winter-view-1.jpg"
        class="morning"
        alt=""
      />
      <img
        src="https://assets.codepen.io/2002878/bilibili-winter-view-2.jpg"
        class="afternoon"
        alt=""
      />
      <video
        autoplay
        loop
        muted
        class="evening"
      >
        <source
          src="https://assets.codepen.io/2002878/bilibili-winter-view-3.webm"
          type="video/webm"
        />
      </video>
      <img
        src="https://assets.codepen.io/2002878/bilibili-winter-view-3-snow.png"
        class="window-cover"
        alt=""
      />
    </div>

    <div class="tree">
      <img
        src="https://assets.codepen.io/2002878/bilibili-winter-tree-1.png"
        class="morning"
        alt=""
      />
      <img
        src="https://assets.codepen.io/2002878/bilibili-winter-tree-2.png"
        class="afternoon"
        alt=""
      />
      <img
        src="https://assets.codepen.io/2002878/bilibili-winter-tree-3.png"
        class="evening"
        alt=""
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.winter-wrap {
  width: 100%;
  height: 160px;
  position: relative;
  overflow: hidden;
  --percentage: 0.5;
  .view,
  .tree {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img,
  video {
    position: absolute;
    display: block;
    width: 160%;
    height: 100%;
    object-fit: cover;
    max-width: 200% !important;
  }
  .morning {
    z-index: 20;
    opacity: calc(1 - (var(--percentage) - 0.25) / 0.25);
  }
  .afternoon {
    z-index: 10;
    opacity: calc(1 - (var(--percentage) - 0.5) / 0.5);
  }
  .view {
    // 此处为外部容器大小的十分之一
    transform: translateX(calc(var(--percentage) * 60px));
  }
  .tree {
    // 此处为上面移动的一半
    transform: translateX(calc(var(--percentage) * 30px));
    filter: blur(3px);
  }
  .view,
  .tree,
  .morning,
  .afternoon {
    transition: all 0.2s ease-in;
  }

  .moving {
    .view,
    .tree,
    .morning,
    .afternoon {
      transition: none;
    }
  }
  .window-cover {
    opacity: calc(1 - (var(--percentage) - 0.9) / 0.1);
  }
}
</style>
