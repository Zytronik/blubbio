<template>
  <div class="leaderboard">
    <LeaderboardRow v-for="i in 10" :key="i" :rank="i"
      :profilePicture="'https://blubbio-space.fra1.cdn.digitaloceanspaces.com/dev-pb/1736629053429-Screenshot%202024-05-30%20225224.png'"
      :name="'Player ' + i" :duration="getRandomTimeString()" :bps="(Math.random() * 2).toFixed(2)" :isMe="i === 4" />
  </div>
</template>

<script lang="ts">
import LeaderboardRow from './LeaderboardRow.vue';


export default {
  name: 'LeaderboardList',
  components: { LeaderboardRow },
  setup() {
    function getRandomTimeString() {
      const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const hundredths = String(Math.floor(Math.random() * 100)).padStart(2, '0');
      return `${minutes}:${seconds}.${hundredths}`;
    }
    return {
      getRandomTimeString
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
</style>