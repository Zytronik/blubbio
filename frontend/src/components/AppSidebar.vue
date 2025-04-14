<template>
  <div class="sidebarWrapper" :style="{ backgroundColor: backgroundColor }" @click.self="goBack()">
    <div v-if="backButtons" class="sidebar" @click.self="goBack()">
      <div v-for="(button, index) in backButtons" :key="index" class="backButton" @mouseenter="handleButtonHover()"
        :class="button.disabled ? 'disabled' : ''" @click="handleButtonClick(button)">
        <div>
          <img :src="button.iconSrc" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useSoundStore } from '@/stores/soundStore';
import { BackButton } from '@/ts/_interface/backButton';
import { transitionPageBackwardsAnimation } from '@/ts/animationCSS/transitionPageBackwards';
import { defineComponent, PropType } from 'vue';


export default defineComponent({
  name: 'AppSidebar',
  components: {},
  props: {
    backButtons: Array as PropType<BackButton[]>,
    backgroundColor: String,
  },
  setup(props) {
    function handleButtonClick(btn: BackButton) {
      transitionPageBackwardsAnimation(btn.page);
    }

    function handleButtonHover() {
      useSoundStore().playSound('menu_hover');
    }

    function goBack() {
      const activeButton = (props.backButtons as BackButton[]).find(btn => !btn.disabled);
      if (activeButton) {
        transitionPageBackwardsAnimation(activeButton.page);
      }
    }

    return {
      handleButtonClick,
      goBack,
      handleButtonHover,
    };
  },

});
</script>

<style scoped>
.sidebarWrapper {
  padding: 5% 0;
  z-index: 1;
  cursor: pointer;
}

.sidebar {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.backButton {
  height: var(--menu-btn-height);
  border: var(--menu-btn-border-width) solid #000;
  border-left: none;
  cursor: pointer;
  position: relative;
  transition: 500ms;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150%;
  margin-left: -25%;
}

.backButton.disabled {
  margin-left: -75%;
}

.backButton.disabled:hover {
  margin-left: -25%;
}

.backButton img {
  height: calc(var(--menu-btn-height) / 1.5);
  object-fit: contain;
}

.backButton::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #161616;
  background-image: url('../assets/img/stripes.png');
  z-index: -1;
  animation: scrollBackButtonBackground 4s linear infinite;
}

.backButton:hover::after {
  animation: scrollBackButtonBackground 2s linear infinite;
  background-color: #2a2a2a;
}

@keyframes scrollBackButtonBackground {
  100% {
    background-position: 226px 0;
    /* 226px is the width of the image */
  }
}
</style>
