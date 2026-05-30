<template>
  <div>
    <h1>Debugger</h1>
    <button @click="refreshLayout">Refresh Layout</button><br><br>
    <button @click="addMonkey">Add Monkey</button><br><br>
    <button @click="kill">Kill Player</button><br><br>
  </div>
</template>

<script lang="ts">
import { debugChannel } from '@/ts/network/debugChannel';


export default {
  name: "DebugRoute",

  methods: {
    refreshLayout() {
      debugChannel.postMessage({ action: "refreshLayout" });
    },

    addMonkey() {
      debugChannel.postMessage({ action: "addMonkeyPlayer" });
    },

    kill() {
      debugChannel.postMessage({
        action: "killPlayer",
        payload: "Player1",
      });
    },
  },
};
</script>