<template>
  <div id="pixiCanvas"></div>
</template>

<script lang="ts">

export default {
  name: 'PixiCanvas',
  components: {},
  setup() {
    return {

    };
  },
};
</script>

<style scoped>
#pixiCanvas {
  position: fixed;
  top: 0;
  z-index: -1;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
