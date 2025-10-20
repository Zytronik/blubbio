<template>
  <h1 class="text-noWhiteSpaces"><span>S</span>print</h1>
  <div class="startbutton-wrapper">
    <button id="startbutton" @click="startSprint()">
      <span>Play</span>
    </button>
  </div>

  <div class="content">
    <div class="content-wrapper">
      <div class="tabs">
        <button v-for="tab in leaderboardTabs" :key="tab" :class="{ active: activeLeaderboard === tab }"
          @click="activeLeaderboard = tab">
          <span>{{ tab }}</span>
          <span v-if="tab === 'National' && userSession.countryCode">
            ({{ userSession.countryCode }})
          </span>
        </button>
      </div>
      <div v-if="activeLeaderboard === 'Global'" class="tab-content">
        <LeaderboardList />
      </div>
      <div v-if="activeLeaderboard === 'National'" class="tab-content">
        <LeaderboardList />
      </div>
      <div v-if="activeLeaderboard === 'Me'" class="tab-content">
        <p v-if="isLoggedIn(userSession)">
          <HistoryList />
        </p>
        <h4 v-else><br>Log in for Stats and Score Submission</h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import { PAGE } from '@/ts/_enum/page';
import { isLoggedIn } from '@/ts/network/auth';
import { computed, ref } from 'vue';
import LeaderboardList from '@/components/LeaderboardList.vue';
import HistoryList from '@/components/HistoryList.vue';
import { transitionIntoGame } from '@/ts/animationCSS/transitionIntoGame';

export default {
  name: 'SprintPage',
  components: { LeaderboardList, HistoryList },
  setup() {
    const leaderboardTabs = ref<string[]>(['Global', 'National', 'Me']);
    const activeLeaderboard = ref<string>('Global');
    const gameStore = useGameStore();
    const userStore = useUserStore();
    const userSession = computed(() => userStore.userSession);

    function startSprint(): void {
      transitionIntoGame();
      // gameStore.startGame();
    }

    return {
      PAGE,
      startSprint,
      leaderboardTabs,
      activeLeaderboard,
      userSession,
      isLoggedIn,
    };
  },
};
</script>

<style scoped>
h1 {
  position: absolute;
  bottom: 35%;
  right: 36%;
  transform: rotate(80deg) skewX(-10deg);
  margin: 0;
  font-size: var(--font-size-6);
}

h1 span {
  font-size: 150%;
}

h4 {
  padding: 0 15px;
  transform: skewX(-10deg);
}

.startbutton-wrapper {
  position: absolute;
  top: 12%;
  left: 0;
  width: 100%;
  height: 28%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 1;
  background-color: white;

}

.startbutton-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #ffffff00, #ffffffe4, #ffffff);
}

.startbutton-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
  background-color: rgb(29, 179, 157, 0.5);
  background-blend-mode: multiply;
  background-size: 320px;
  background-image: url('../assets/img/stripes.png');
  z-index: -1;
  animation: scrollPlayButtonBackground 4s linear infinite;
}

@keyframes scrollPlayButtonBackground {
  100% {
    background-position: -320px 0;
    /* 320px is the width of the image */
  }
}

#startbutton:hover span {
  letter-spacing: 8px;
  transform: scale(1.03) skewX(-18deg);
}

#startbutton {
  border: none;
  border-radius: 0;
  padding: 0;
  background-color: transparent;
  height: 100%;
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  position: relative;
}

#startbutton span {
  transition: 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  height: 100%;
  width: 100%;
  text-transform: uppercase;
  transform: skewX(-18deg);
  font-size: var(--font-size-9);
  letter-spacing: var(--font-big-letter-spacing);
}

.content {
  z-index: 1;
  height: 75%;
  bottom: 0;
  width: 48%;
  position: absolute;
  transform: skewX(10deg);
  box-sizing: border-box;
  padding-top: var(--menu-btn-border-width);
  padding-right: var(--menu-btn-border-width);
  scrollbar-color: var(--sprint-color) transparent;
  scrollbar-width: thin;
}

.content::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  border-bottom: 15vw solid transparent;
  border-left: 30vh solid transparent;
  height: 15%;
  width: 20%;
  border-top: var(--menu-btn-border-width) solid var(--sprint-color);
  border-right: var(--menu-btn-border-width) solid var(--sprint-color);
}

.content::after {
  content: "";
  background-color: #e8eeeb;
  position: absolute;
  right: 0;
  top: 0;
  width: 200%;
  height: 200%;
  z-index: -1;
  border: var(--menu-btn-border-width) solid #000;
}

.content-wrapper {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  color: #000;
}

.tabs {
  position: absolute;
  left: 0;
  bottom: 100%;
  transform: skewX(-10deg);
}

.tabs button {
  background-color: #000;
}

.tab-content {
  background-color: transparent;
  padding: 0;
}
</style>
