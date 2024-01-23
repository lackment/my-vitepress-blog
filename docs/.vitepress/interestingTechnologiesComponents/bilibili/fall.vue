<script setup>
import { onMounted, ref } from 'vue'
const fall = ref()
const imagesList = ref()
const fallMouseMove = (e) => {
  let percentage =
    (e.clientX - fall.value.getBoundingClientRect().left) / fall.value.offsetWidth
  let offset = 10 * percentage
  let blur = 20

  for (let [index, image] of imagesList.value.entries()) {
    offset *= 1.3

    let blurValue = Math.pow(index / imagesList.value.length - percentage, 2) * blur

    image.style.setProperty('--offset', `${offset}px`)
    image.style.setProperty('--blur', `${blurValue}px`)
  }
}

onMounted(() => {
  const images = document.querySelectorAll('.fall-image-wrap > img')
  imagesList.value = images
})
</script>

<template>
  <div
    class="fall-warp"
    ref="fall"
    @mousemove="fallMouseMove"
  >
    <div class="fall-image-wrap">
      <img src="https://assets.codepen.io/2002878/bilibili-autumn-1.png" />
    </div>
    <div class="fall-image-wrap">
      <img src="https://assets.codepen.io/2002878/bilibili-autumn-2.png" />
    </div>
    <div class="fall-image-wrap">
      <img src="https://assets.codepen.io/2002878/bilibili-autumn-3.png" />
    </div>
    <div class="fall-image-wrap">
      <img src="https://assets.codepen.io/2002878/bilibili-autumn-4.png" />
    </div>
    <div class="fall-image-wrap">
      <img src="https://assets.codepen.io/2002878/bilibili-autumn-5.png" />
    </div>
    <div class="fall-image-wrap">
      <img src="https://assets.codepen.io/2002878/bilibili-autumn-6.png" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.fall-warp {
  width: 100%;
  height: 160px;
  position: relative;
  overflow: hidden;
  > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    --offset: 0px;
    --blur: 2px;
    img {
      display: block;
      width: 110%;
      height: 100%;
      object-fit: cover;
      max-width: 200% !important;
      transform: translatex(var(--offset));
      filter: blur(var(--blur));
    }
  }
}
</style>
