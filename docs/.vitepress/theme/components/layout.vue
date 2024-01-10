<script setup lang="ts">
import { useData } from "vitepress";
import { nextTick, provide, watch } from "vue";
import BlogTheme from "@sugarat/theme";
import Documate from "@documate/vue";
import "@documate/vue/dist/style.css";

const { isDark, page } = useData();

const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`,
  ];

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );
});

watch(
  () => page.value,
  (val) => {
    if (val.filePath !== "index.md") {
      document
        .getElementById("waifu-toggle")
        ?.style.setProperty("display", "none");
      document.getElementById("waifu")?.style.setProperty("display", "none");
    }
    if (val.filePath === "index.md") {
      document
        .getElementById("waifu-toggle")
        ?.style.setProperty("display", "block");
      document.getElementById("waifu")?.style.setProperty("display", "block");
    }
  },
  { deep: true }
);

const particles = {
  particles: {
    number: {
      value: 52,
      density: {
        enable: true,
        value_area: 631.3280775270874,
      },
    },
    color: {
      value: "#fff",
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
      polygon: {
        nb_sides: 5,
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100,
      },
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 5,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: false,
      distance: 500,
      color: "#ffffff",
      opacity: 0.4,
      width: 2,
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "bottom",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: false,
        mode: "bubble",
      },
      onclick: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 0.5,
        },
      },
      bubble: {
        distance: 400,
        size: 4,
        duration: 0.3,
        opacity: 1,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
};
</script>

<template>
  <BlogTheme.Layout>
    <template v-slot:nav-bar-content-before>
      <Documate endpoint="https://hbfue1ntki.us.aircode.run/ask"></Documate>
    </template>
    <template v-slot:home-hero-before>
      <vue-particles id="tsparticles" :options="particles" />
    </template>
  </BlogTheme.Layout>
</template>

<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
#tsparticles {
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
