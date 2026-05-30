<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { useDebugStore } from "@/stores/debugStore";

const debugStore = useDebugStore();

const handleBeforeUnload = () => {
  debugStore.closeDebugWindow();
  debugStore.destroyDebugChannel();
};

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  debugStore.closeDebugWindow();
});
</script>