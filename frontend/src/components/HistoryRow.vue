<template>
  <div class="row">
    <div class="cell">
      <p>{{ date }}</p>
    </div>
    <div class="cell">
      <p>{{ cleared }}</p>
    </div>
    <div class="cell">
      <p>{{ duration }}</p>
    </div>
    <div class="cell">
      <p>{{ bps }} BPS</p>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  name: 'LeaderboardRow',
  props: {
    date: String,
    duration: String,
    cleared: Number,
    bps: String,
  },
  setup() {
    return {
    };
  },
};
</script>

<style scoped>
.cell {
  justify-content: center;
}

.cell:first-of-type {
  justify-content: flex-start;
}

.cell:nth-of-type(2) {
  flex: 0.6;
}

.cell:nth-child(3) {
  color: var(--sprint-color);
}
</style>