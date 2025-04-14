<template>
  <div class="tabs">
    <button v-for="tab in tabs" :key="tab" :class="{ active: currentTab === tab }" @click="currentTab = tab">
      {{ tab }}
    </button>
  </div>

  <div class="tab-content">
    <InputSettingsTab v-if="currentTab === 'Input Settings'" />
    <HandlingSettingsTab v-if="currentTab === 'Handling Settings'" />
    <GraphicsSettingsTab v-if="currentTab === 'Graphics Settings'" />
    <AudioSettingsTab v-if="currentTab === 'Audio Settings'" />
    <AccountSettingsTab v-if="currentTab === 'Account Settings'" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue';
import InputSettingsTab from '@/components/settings/InputSettingsTab.vue';
import HandlingSettingsTab from '@/components/settings/HandlingSettingsTab.vue';
import GraphicsSettingsTab from '@/components/settings/GraphicsSettingsTab.vue';
import AudioSettingsTab from '@/components/settings/AudioSettingsTab.vue';
import AccountSettingsTab from '@/components/settings/AccountSettingsTab.vue';
import { saveSettings } from '@/ts/page/settings';

export default defineComponent({
  name: 'SettingsPage',
  components: {
    InputSettingsTab,
    HandlingSettingsTab,
    GraphicsSettingsTab,
    AudioSettingsTab,
    AccountSettingsTab,
  },
  data() {
    return {
      currentTab: 'Input Settings',
      tabs: ['Input Settings', 'Handling Settings', 'Graphics Settings', 'Audio Settings', 'Account Settings'],
    };
  },
  setup() {
    onUnmounted(() => {
      saveSettings();
    });
  },
});
</script>

<style>
.settings {
  scrollbar-color: var(--config-color) transparent;
  scrollbar-width: thin;
}

.settings .resetBtn {
  width: 200px;
  margin-right: 30px;
}

.settings .setting {
  display: flex;
  width: 100%;
  background-color: var(--light-bg-color);
  padding: 10px;
}

.settings .text {
  width: 40%;
}

.settings .keys {
  width: 60%;
  display: flex;
  align-items: center;
}

.settings-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
}
</style>
