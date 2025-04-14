<template>
  <div class="leaderboard">
    <div class="head">
      <div class="row">
        <div class="cell">
          <p>Submitted At</p>
        </div>
        <div class="cell">
          <p>Cleared</p>
        </div>
        <div class="cell">
          <p>Duration</p>
        </div>
        <div class="cell">
          <p>Bubbl. Per Sec.</p>
        </div>
      </div>
    </div>
    <HistoryRow v-for="i in 10" :key="i" :date="'4 months ago'" :duration="getRandomTimeString()"
      :cleared="Math.floor(Math.random() * 11) + 100" :bps="(Math.random() * 2).toFixed(2)" />
  </div>
</template>

<script lang="ts">
import HistoryRow from './HistoryRow.vue';


export default {
  name: 'HistoryList',
  components: { HistoryRow },
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
.head {
  background-color: hsla(0, 0%, 58%, 0.3);
}

.head .cell {
  font-size: var(--font-size-1);
  justify-content: center;
}

.row {
  display: flex;
  flex-direction: row;
  text-align: center;
  cursor: pointer;
  padding: 0 10px;
  transition: 0.2s;
}

.row:hover {
  background-color: hsla(0, 0%, 58%, .2);
}

.cell {
  height: 70px;
  font-size: var(--font-size-3);
  text-transform: uppercase;
  font-weight: 700;
  transform: skewX(-10deg);
  flex: 1;
  padding: 15px 10px;
  display: flex;
  align-items: center;
}

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