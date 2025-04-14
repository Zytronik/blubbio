<template>
  <div class="pageTitle">
    <h1><span class="text-noWhiteSpaces">S</span><span class="text-noWhiteSpaces">ingleplayer</span></h1>
  </div>
  <div class="menuWrapper">
    <div v-for="(button, index) in menuButtonsData" :key="index" :class="[
      'menuBtn',
      button.title.toLowerCase().replace(/\s+/g, '-'),
      { 'shortMenuBtn': !button.bigButton },
      { 'disabledMenuBtn': isButtonDisabled(button) }
    ]" v-bind="getMenuButtonAttributes(button)">
      <div>
        <div class="text">
          <p class="firstLetter text-noWhiteSpaces">{{ button.title[0] }}</p>
          <p>
            <span class="text-noWhiteSpaces">{{ button.title.slice(1) }}</span>
            <span class="desc">{{ button.desc }}</span>
          </p>
        </div>
        <img :src="button.iconSrc" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PAGE } from '@/ts/_enum/page';
import { MenuButton } from '@/ts/_interface/menuButton';
import { getMenuButtonAttributes, isButtonDisabled } from '@/ts/page/menuButtons';
import { setPage } from '@/ts/page/pageManager';
import { ref } from 'vue';

export default {
  name: 'SoloMenu',
  components: {},
  setup() {
    const menuButtonsData = ref<MenuButton[]>([
      {
        title: "Sprint",
        desc: "Go very very fast",
        iconSrc: require(`@/assets/img/icons/sprint.png`),
        page: PAGE.sprintPage,
        bigButton: true,
      },
      {
        title: "Highscore",
        desc: "Send as much attack, in limited time",
        iconSrc: require(`@/assets/img/icons/score.png`),
        page: PAGE.scorePage,
        bigButton: false,
        authIds: [1, 2, 3],
      }
    ]);

    return {
      menuButtonsData,
      PAGE,
      setPage,
      isButtonDisabled,
      getMenuButtonAttributes,
    };
  }
}
</script>

<style scoped></style>
