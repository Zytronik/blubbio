<template>
    <div id="pixiCanvas"></div>
</template>

<script lang="ts">

export default {
    name: 'GamePage',
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
    background-color: red;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
