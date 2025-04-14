<template>
  <div class="row" :class="{ me: isMe }">
    <div class="cell">
      <p>#{{ rank }}</p>
    </div>
    <div class="cell">
      <div class="user-info">
        <img :src="profilePicture" />
        <p>{{ name }}</p>
      </div>
    </div>
    <div class="cell">
      <p>{{ duration }}</p>
    </div>
    <div class="cell">
      <p>{{ bps }} bps</p>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  name: 'LeaderboardRow',
  props: {
    rank: Number,
    profilePicture: String,
    name: String,
    duration: String,
    bps: String,
    isMe: Boolean
  },
  setup() {
    return {
    };
  },
};
</script>

<style scoped>
.me {
  background-color: hsla(0, 0%, 58%, .3);
}

.cell:first-of-type {
  flex: 0.3;
  text-align: left;
}

.cell:nth-of-type(2) {
  flex: 1.8;
  text-align: left;
  z-index: 1;
}

.cell:nth-child(3) {
  color: var(--sprint-color);
}

.row:first-of-type .cell:first-of-type p {
  color: #907a00;
}

.row:nth-of-type(2) .cell:first-of-type p {
  color: #878787;
}

.row:nth-of-type(3) .cell:first-of-type p {
  color: #cd7f32;
}

.row:nth-of-type(4) {
  border-top: 5px solid transparent;
  position: relative;
}

.row:nth-of-type(4)::after {
  content: "";
  position: absolute;
  top: -5px;
  right: 0;
  border-left: 40vw solid transparent;
  border-top: 5px solid #000;
  height: 100%;
  width: 10%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.user-info img {
  height: 40px;
  width: 40px;
}
</style>