<template>
    <div class="overlay community" @click.self="closeCommunityOverlay()">
        <div class="overlay-container">
            <button class="openChannelButton" @click="closeCommunityOverlay()">Community</button>
            <svg width="964" height="200" viewBox="0 0 964 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M862 0H102L0 100L102 200H862L964 100L862 0Z" fill="black" />
            </svg>
            <h2>Welcome to Blubb.io</h2>
        </div>
    </div>
</template>

<script lang="ts">
import { closeCommunityOverlay } from '@/ts/animationCSS/closeCommunityOverlay';

export default {
    name: 'CommunityOverlay',
    components: {},
    setup() {
        return {
            closeCommunityOverlay,
        };
    },
};
</script>

<style scoped>
.overlay-container {
    width: 100%;
    height: calc(100vh - var(--header-height));
    border-radius: 0;
    position: absolute;
    bottom: 0;
    z-index: 10;
    background-color: black;
}

.openChannelButton,
.openChannelButton+svg {
    top: 0;
    transform: translate(-50%, -50%);
}
</style>