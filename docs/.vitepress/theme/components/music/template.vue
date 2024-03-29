<template>
  <div class="vitepress-music" :class="playClassName">
    <div class="vitepress-music__drawer">
      <div class="vitepress-music__drawer-header">
        <div>
          <span class="iconfont icon-shouqi" @click="handleShowList"></span>
          <span>Playlist</span>
        </div>
        <span>Total {{ audioList?.length || 0 }}</span>
      </div>
      <ul class="vitepress-music__drawer-content">
        <template v-for="(item, index) in audioList">
          <li
            v-if="!item.hide"
            :key="item.name"
            :class="{
              active: playInfo.currentIndex === index,
              error: playInfo.errorIndexList.includes(index),
              playing: isPlay && playInfo.currentIndex === index,
            }"
            @click="handleChangePlayIndex(index)"
          >
            <div>{{ item.name }}</div>
            <div>{{ item.author }}</div>
          </li>
        </template>
      </ul>
    </div>
    <div class="vitepress-music__trigger">
      <span
        class="iconfont icon-changpianji"
        @click="handleChangePlayStatus"
      ></span>
      <span
        class="iconfont icon-shangyishou"
        @click="handleChangePlayIndex(playInfo.currentIndex - 1)"
      ></span>
      <span
        class="iconfont icon-xiayishou"
        @click="handleChangePlayIndex(playInfo.currentIndex + 1)"
      ></span>
      <span class="iconfont icon-gedan" @click="handleShowList"></span>
    </div>
    <audio
      ref="audioRef"
      :src="currentSongInfo.file"
      controls="controls"
      preload="auto"
      @ended="handleChangePlayIndex(playInfo.currentIndex + 1)"
      @error="handleAudioError()"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from "vue";
import { audioVolumeFade } from "./utils/audio";
import type { Ref } from "vue";

interface SongInfo {
  name: string;
  author: string;
  file: string;
  mins?: string;
  hide?: boolean;
}

const props = defineProps<{
  list: SongInfo[];
}>();

enum PlayStatus {
  play,
  pause,
  stop,
}

const playInfo = ref({
  status: PlayStatus.stop,
  showList: false,
  currentIndex: 0,
  errorIndexList: [],
});
const audioList = computed(() => props.list.filter((i) => !i.hide));
const isPlay = computed(() => playInfo.value.status === PlayStatus.play);
const isPause = computed(() => playInfo.value.status === PlayStatus.pause);
const isStop = computed(() => playInfo.value.status === PlayStatus.stop);
const playClassName = computed(() => ({
  "is-play": isPlay.value,
  "is-pause": isPause.value,
  "is-stop": isStop.value,
  "is-show-list": playInfo.value.showList,
}));
const currentSongInfo = computed(
  () => audioList.value[playInfo.value.currentIndex]
);

const handleChangePlayStatus = () => {
  playInfo.value.status = isPlay.value ? PlayStatus.pause : PlayStatus.play;
};
const handleShowList = () => {
  playInfo.value.showList = !playInfo.value.showList;
};

const audioRef: Ref<HTMLAudioElement> = ref();
const handleChangePlayIndex = (newIndex: number) => {
  handleShowList();
  if (newIndex === playInfo.value.currentIndex) return handleChangePlayStatus();
  playInfo.value.status = PlayStatus.stop;
  playInfo.value.currentIndex =
    newIndex < 0
      ? audioList.value.length - 1
      : newIndex > audioList.value.length - 1
      ? 0
      : newIndex;
  nextTick(() => (playInfo.value.status = PlayStatus.play));
};
const handleAudioError = () => {
  const { errorIndexList, currentIndex } = playInfo.value;
  if (!errorIndexList.includes(currentIndex)) errorIndexList.push(currentIndex);
  if (errorIndexList.length < audioList.value.length)
    handleChangePlayIndex(currentIndex + 1);
};

watch(
  () => playInfo.value.status,
  async (value) => {
    switch (value) {
      case PlayStatus.play:
        audioRef.value.play();
        audioVolumeFade(audioRef.value, true);
        break;
      case PlayStatus.pause:
        await audioVolumeFade(audioRef.value, false);
        audioRef.value.pause();
        break;
      case PlayStatus.stop:
        await audioVolumeFade(audioRef.value, false);
        audioRef.value.pause();
        break;

      default:
        break;
    }
  }
);
</script>

<style lang="scss">
@font-face {
  font-family: "iconfont";
  src: url("../../assets/fonts/iconfont.ttf") format("truetype");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-shouqi:before {
  content: "\e655";
}

.icon-gedan:before {
  content: "\e636";
}

.icon-changpianji:before {
  content: "\e616";
}

.icon-shangyishou:before {
  content: "\e718";
}

.icon-xiayishou:before {
  content: "\e719";
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fade-in {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 0.9;
  }
}
.vitepress-music {
  position: fixed;
  bottom: 100px;
  right: 0;
  z-index: 100;
  &__trigger {
    width: 120px;
    height: 30px;
    border-radius: 15px 0 0 15px;
    cursor: pointer;
    background-color: var(--vp-c-bg-alt);
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1), 0 3px 4px 0 rgba(0, 0, 0, 0.07),
      0 3px 3px -2px rgba(0, 0, 0, 0.06);
    transform: translateX(90px);
    transition: 200ms transform;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #8a8a8a;
    &:hover {
      transform: translateX(0);
    }
    span {
      transition: 500ms;
      font-size: 20px;
      &:hover {
        color: var(--vp-c-brand);
      }
      &:nth-of-type(1) {
        animation: rotate 2s linear infinite paused;
      }
    }
  }
  &__drawer {
    position: absolute;
    top: -300px;
    right: 0;
    width: 200px;
    height: 300px;
    background-color: var(--vp-c-bg-alt);
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1), 0 3px 4px 0 rgba(0, 0, 0, 0.07),
      0 3px 3px -2px rgba(0, 0, 0, 0.06);
    font-size: 12px;
    padding: 12px 10px;
    transform-origin: bottom right;
    transform: scale(0);
    transition: 200ms transform;
    border-radius: 3px 0 0 3px;
    display: flex;
    flex-direction: column;
    &-header {
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--vp-c-text-2);
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon-shouqi {
          font-size: 10px;
          margin-right: 5px;
          cursor: pointer;
          transition: 500ms;
          &:hover {
            color: var(--vp-c-brand);
          }
        }
      }
      /* display: none; */
    }
    &-content {
      overflow: auto;
      li {
        position: relative;
        display: flex;
        cursor: pointer;
        padding: 2px 0;
        color: var(--vp-c-text-1);
        overflow: hidden;
        > * {
          flex-wrap: nowrap;
          flex-shrink: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        :nth-child(1) {
          flex-grow: 1;
          width: 0;
          padding-right: 5px;
        }
        :nth-child(2) {
          width: 50px;
          text-align: right;
        }
        &.active {
          color: var(--vp-c-brand);
        }
        &.error {
          color: var(--vp-c-red-dimm-1);
          text-decoration-line: line-through;
        }
        &:hover {
          &:after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--vp-c-bg-alt);
            color: var(--vp-c-brand);
            text-align: center;
            font-style: oblique;
            animation: fade-in 500ms forwards;
          }
          &.playing:after {
            content: "click to pause";
          }
          &.error:after {
            content: "click to re-request";
            color: var(--vp-c-red-dimm-1);
          }
          &:not(.playing, .error):after {
            content: "click to play";
          }
        }
      }
    }
  }
  &.is-play {
    .vitepress-music__trigger {
      span {
        &:nth-of-type(1) {
          color: var(--vp-c-brand);
          animation-play-state: running;
        }
      }
    }
  }
  &.is-pause {
  }
  &.is-stop {
  }
  &.is-show-list {
    .vitepress-music__trigger {
      span {
        &:nth-of-type(4) {
          color: var(--vp-c-brand);
        }
      }
    }
    .vitepress-music__drawer {
      transform: scale(1);
    }
  }
  audio {
    display: none;
  }
}
</style>
