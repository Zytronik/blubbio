<template>
  <div class="topbar">
    <div class="profile-wrapper" v-if="isGuestOrLoggedIn(userSession)" @click="openCommunityOverlay()">
      <img class="profile-pic" :src="getUserPbUrl(userSession)" alt="Profile Picture">
      <div class="profile-content">
        <h3>{{ userSession.username }}</h3>
        <div class="ratingDetails">
          <p v-if="userSession && userSession.isRanked" class="rating">{{ userSession.rating
          }}<span>±{{
              userSession.ratingDeviation }}</span>
          </p>
          <img v-if="userSession && userSession.isRanked" class="rank-img"
            :src="getUserRankImgUrl(userSession.rank.iconName)" :alt="userSession.rank.name">
          <p v-else class="unranked">Unranked</p>
        </div>
        <div v-if="userSession && userSession.isRanked" class="progressBar-wrapper">
          <div class="progressBar">
            <div class="progressBarFill" :style="{
              'width': getProgressBarFillWidth(),
            }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { getUserPbUrl, getUserRankImgUrl } from '@/ts/page/paths';
import { openCommunityOverlay } from '@/ts/animationCSS/openCommunityOverlay';
import { isGuestOrLoggedIn, logUserOut } from '@/ts/network/auth';
import { computed } from 'vue';

export default {
  name: 'AppHeader',
  components: {},
  setup() {
    const userStore = useUserStore();
    const userSession = computed(() => userStore.userSession);

    function getProgressBarFillWidth() {
      if (!userSession.value) {
        return '0%';
      }
      const rank = userSession.value.rank;
      if (!rank.nextRank) {
        return '0%';
      }
      return (100 - (100 / (rank.percentile - rank.nextRank.percentile) * (rank.percentile - userSession.value.percentile))) + '%';
    }

    return {
      userSession,
      logUserOut,
      getUserPbUrl,
      getUserRankImgUrl,
      isGuestOrLoggedIn,
      getProgressBarFillWidth,
      openCommunityOverlay,
    };
  },
};
</script>

<style scoped>
.topbar {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: calc(var(--header-height) / 2);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: black;
  color: white;
}

.profile-wrapper {
  height: var(--header-height);
  width: var(--header-profile-width);
  background-color: black;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.profile-wrapper::before {
  position: absolute;
  content: '';
  width: 0px;
  height: 1px;
  border-style: solid;
  border-width: calc(var(--header-height) / 2) var(--header-height) calc(var(--header-height) / 2) 0;
  border-color: transparent black transparent transparent;
  display: inline-block;
  vertical-align: middle;
  right: 100%;
  top: 0;
}

.profile-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 30px 10px 15px;
}

.profile-content .ratingDetails {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  font-size: var(--font-size-2);
  align-items: center;
}

.profile-content .progressBar {
  width: 90%;
  height: 4px;
  background-color: #575757;
  margin-top: 5px;
}

.profile-content .progressBar .progressBarFill {
  height: 100%;
  background-color: rgb(244, 205, 33);
}

.profile-content .rating span {
  font-size: 80%;
  opacity: 0.5;
}

.profile-content .ratingDetails .rank-img {
  margin-left: 5px;
  object-fit: contain;
  height: 3vh;
}

.profile-content h3 {
  margin: unset;
  font-size: var(--font-size-2);
}

.profile-content p {
  margin: unset;
}

.profile-pic {
  height: 100%;
  width: 10vh;
  object-fit: cover;
}
</style>
