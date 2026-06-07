<template>
  <div class="leaderboard">
    <div v-if="loading" class="loader">
    </div>

    <div v-else-if="entries.length === 0" class="no-entries">
      No leaderboard data yet
    </div>
    <div v-if="!loading && entries.length > 0">
      <LeaderboardRow v-for="entry in entries" :key="entry.rank" :rank="entry.rank" :name="entry.username"
        :duration="formatTime(entry.gameDuration)" :bps="entry.bubblesPerSecond" :isMe="entry.userId === userId"
        :profilePicture="entry.profilePicture || getUserProfilePicturePlaceholderUrl()" />
    </div>
  </div>
</template>

<script lang="ts">
import { LeaderboardEntryDto } from '@shared/types';
import { getUserProfilePicturePlaceholderUrl } from '@/ts/page/paths';
import LeaderboardRow from './LeaderboardRow.vue';
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'LeaderboardList',
  components: { LeaderboardRow },
  props: {
    entries: {
      type: Array as () => LeaderboardEntryDto[],
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const userStore = useUserStore();
    const userId = computed(() => userStore.userSession?.userId);

    function formatTime(ms: number) {
      const totalSeconds = ms / 1000;

      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
      const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
      const hundredths = String(Math.floor((totalSeconds % 1) * 100)).padStart(2, "0");

      return `${minutes}:${seconds}.${hundredths}`;
    }
    return {
      formatTime,
      getUserProfilePicturePlaceholderUrl,
      userId
    };
  },
};
</script>

<style scoped>
.cell:first-of-type {
  text-align: left;
}

.cell:nth-of-type(2) {
  flex: 0.6;
}

.cell:nth-child(3) {
  color: var(--sprint-color);
}

.no-entries {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
}

.no-entries,
.loader {
  transform: skewX(-10deg);
}
</style>