<template>
    <div>Resultsscreen</div>
    <button @click="startSprint()">Retry</button>
    <button @click="backToMenu()">Back to menu</button>
</template>

<script lang="ts">
import { GAME_MODE } from '@/ts/_enum/gameMode';
import { PAGE } from '@/ts/_enum/page';
import { transitionIntoGame } from '@/ts/cssAnimation/transitionIntoGame';
import { transitionPageBackwardsAnimation } from '@/ts/cssAnimation/transitionPageBackwards';

export default {
    name: 'SoloResultsPage',
    components: {},
    setup() {
        function backToMenu(): void {
            transitionPageBackwardsAnimation(PAGE.sprintPage);
        }

        function startSprint(): void {
            transitionIntoGame(GAME_MODE.SPRINT);
        }

        return {
            startSprint,
            backToMenu
        };
    },
};
</script>

<style scoped></style>
