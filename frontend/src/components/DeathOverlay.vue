<template>
    <div class="death-overlay">
        <h2>You Died</h2>
        <button @click="startSprint()">Retry</button>
        <button @click="backToMenu()">Back to menu</button>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { GAME_MODE } from '@/ts/_enum/gameMode';

defineOptions({
    name: 'DeathOverlay',
});

const props = defineProps<{
    gameMode: GAME_MODE;
    onClose: () => void;
}>();


function backToMenu(): void {
    // transitionOutOfGame(props.gameMode, PAGE.sprintPage);
    useGameStore().cancelGame();
    props.onClose();
}

function startSprint(): void {
    // gameStore.setupSprint();
    useGameStore().resetGame();
    props.onClose();
}
</script>

<style scoped>
.death-overlay {
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
</style>
