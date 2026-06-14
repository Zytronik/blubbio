<template>
  <AppHeader />
  <main>
    <LoadingScreen :is-loading="pageIsLoading" />
    <ToastMessages />
    <PatchNotes />
    <CommunityOverlay v-if="showCommunity" />
    <LoginOverlay v-if="showLogin" />
    <article class="pageWrapper">
      <AppSidebar :back-buttons="currentBackButtons" :background-color="currentPageColor" />
      <section class="pageContainer" :class="currentPageName" v-if="currentComponent">
        <component :is="currentComponent" :key="currentPage" />
      </section>
    </article>
    <PixiCanvas />
  </main>
  <AppFooter />
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePageStore } from '@/stores/pageStore';
import { useDebugStore } from '@/stores/debugStore';
import { useSocketStore } from '@/stores/socketStore';
import { useSoundStore } from '@/stores/soundStore';
import { checkUserAuthentication, logUserOut } from '@/ts/network/auth';
import { allPages } from '@/ts/page/allPages';
import { initPageTransitionWatcher, checkIfCanJoinRoomByUrl } from '@/ts/page/pageManager';
import { waitForLoadingScreen } from '@/ts/page/preload';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import LoginOverlay from '@/components/LoginOverlay.vue';
import ToastMessages from '@/components/ToastMessages.vue';
import LoadingScreen from '@/components/LoadingOverlay.vue';
import PatchNotes from '@/components/PatchNotes.vue';
import CommunityOverlay from '@/components/CommunityOverlay.vue';
import PixiCanvas from '@/components/PixiCanvas.vue';

export default {
  name: 'GameRoute',
  components: {
    AppHeader,
    AppFooter,
    PixiCanvas,
    AppSidebar,
    LoginOverlay,
    ToastMessages,
    LoadingScreen,
    PatchNotes,
    CommunityOverlay,
  },
  setup() {
    const pageStore = usePageStore();
    const currentPage = storeToRefs(pageStore);
    const currentComponent = computed(() => allPages[pageStore.currentPage].component);
    const currentPageName = computed(() => pageStore.currentPage);
    const currentBackButtons = computed(() => allPages[pageStore.currentPage].backButtons);
    const currentPageColor = computed(() => allPages[pageStore.currentPage].color);
    const showLogin = computed(() => !pageStore.isLoggedIn);
    const socketStore = useSocketStore();
    const pageIsLoading = ref(true);
    const showCommunity = computed(() => pageStore.showCommunity);
    const debugStore = useDebugStore();

    initPageTransitionWatcher();
    checkUserAuthentication();

    const soundStore = useSoundStore();

    onMounted(async () => {
      await waitForLoadingScreen();
      pageIsLoading.value = false;
      soundStore.playMusic("menu_soundtrack");
      checkIfCanJoinRoomByUrl();
      debugStore.initDebugChannel();
      // debugStore.openDebugWindow();
    });

    onUnmounted(() => {
      socketStore.disconnectSocket();
      debugStore.closeDebugWindow();
      debugStore.destroyDebugChannel();
    });

    return {
      currentComponent,
      currentBackButtons,
      currentPageName,
      currentPageColor,
      currentPage,
      showLogin,
      logUserOut,
      pageIsLoading,
      showCommunity,
    };
  },
};
</script>

<style scoped></style>
