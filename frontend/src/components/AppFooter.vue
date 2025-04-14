<template>
  <div class="bottomBar" @click="openCommunityOverlay()">
    <button class="openChannelButton">Community</button>
    <svg width="964" height="200" viewBox="0 0 964 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M862 0H102L0 100L102 200H862L964 100L862 0Z" fill="black" />
    </svg>
  </div>
</template>

<script lang="ts">
import { openCommunityOverlay } from '@/ts/animationCSS/openCommunityOverlay';

export default {
  name: 'AppFooter',
  components: {},
  setup() {
    return {
      openCommunityOverlay
    };
  },
};
</script>

<style scoped>
.bottomBar {
  position: absolute;
  width: 100vw;
  height: calc(var(--header-height) / 2);
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  cursor: pointer;
  transition: 150ms;
  z-index: 1;
}

.bottomBar>* {
  top: calc(var(--header-height) / -2);
}

.bottomBar:hover {
  height: calc(var(--header-height) * 0.75);
}

.bottomBar::after {
  content: "";
  position: absolute;
  width: 100vw;
  height: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: black;
  z-index: 0;
}
</style>
