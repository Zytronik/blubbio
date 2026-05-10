<template>
  <div class="leaderboard">
    <LeaderboardRow v-for="i in 10" :key="i" :rank="i"
      :profilePicture="'https://9svghmex86z5bzh4.public.blob.vercel-storage.com/pb/1777928663326-208350.jpg'"
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