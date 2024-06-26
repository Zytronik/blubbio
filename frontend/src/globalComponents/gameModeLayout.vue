<template>
    <MenuBackButtons :buttonData="backButtonData" :specialBehavior="specialBackButtonBehavior"
        @special-click-event="goBack" />
    <div class="page-wrapper">
        <div class="page-container">
            <div v-if="isDashboard" class="gameMode-dashboard page-dashboard">
                <div class="content-title">
                    <h1><span class="text-noWhiteSpaces">{{ gameMode[0] }}</span><span class="text-noWhiteSpaces">{{
                            gameMode.slice(1) }}</span></h1>
                </div>
                <div class="play-wrapper">
                    <button @mouseenter="playSound('menu_hover')" v-if="gameMode != 'score'" class="playButton"
                        @click="play()"><span>Play</span></button>
                    <p v-else><br>Highscore Mode is not available yet.</p>
                </div>
                <div class="content">
                    <div class="content-wrapper">
                        <div class="l-tab-buttons">
                            <button class="l-tab-button" v-for="tab in leaderboardTabs" :key="tab"
                                :class="{ active: currentLeaderboard === tab }" @click="currentLeaderboard = tab">
                                <span>{{ tab }}</span>
                                <span v-if="tab === 'National' && userData?.countryCode">
                                    ({{ userData.countryCode }})
                                </span>
                            </button>
                        </div>
                        <div v-if="currentLeaderboard === 'Global'" class="l-tab global-tab">
                            <Leaderboard :gameMode="gameMode" :fields="leaderboardFields"
                                :sortBy="leaderboardSortByField" :sortDirection="SortDirection.Asc"
                                :leaderboardCategory="LeaderboardCategory.Global" :limit="30" />
                        </div>
                        <div v-if="currentLeaderboard === 'National'" class="l-tab national-tab">
                            <Leaderboard :gameMode="gameMode" :fields="leaderboardFields"
                                :sortBy="leaderboardSortByField" :sortDirection="SortDirection.Asc"
                                :leaderboardCategory="LeaderboardCategory.National" :limit="30" />
                        </div>
                        <div v-if="currentLeaderboard === 'Me'" class="l-tab national-tab">
                            <History v-if="!isGuest" :gameMode="gameMode"
                                :fields="['submittedAt', 'bubblesCleared', 'gameDuration', 'bubblesPerSecond']"
                                :sortBy="'submittedAt'" :sortDirection="SortDirection.Desc" :limit="10" />
                            <h4 v-else><br>Log in for Stats and Submit Scores.</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="isGaming" class="inGame">
                <Game :playerGameVisuals="playerGameVisuals" :areRef="true" :gameMode="gameMode" />
            </div>

            <div v-if="isResultView" class="gameComplete">
                <div class="topbar">
                    <!-- <button @click="openNetworkEvaluation()">Network Evaluation</button> -->
                    <p v-if="sprintRecordDate">{{ sprintRecordDate }}</p>
                </div>
                <div class="top">
                    <div class="resultValue">
                        <p v-if="resultStats" class="rValue">{{ formatTimeNumberToString(resultStats.gameDuration ?? 0)
                            }}
                        </p>
                        <p class="diff" v-if="diffToPb">Diff to pb: {{ formatTimeNumberToString(diffToPb ?? 0) }}</p>
                        <p class="pb" v-if="diffToPb === 0">Personal Best!</p>
                    </div>
                    <button v-if="!hideRetryButton" class="retry" @click="play()">Retry</button>
                </div>
                <LineChart v-if="resultStats" :data="resultStats.bpsGraph ?? []" />
                <div v-if="resultStats">
                    <div class="columns">
                        <div class="column">
                            <div class="row" key="bubblesCleared">
                                <div class="col">{{ getFullName("bubblesCleared") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.bubblesCleared ?? '', "bubblesCleared")
                                    }}</div>
                            </div>
                            <div class="row" key="bubblesShot">
                                <div class="col">{{ getFullName("bubblesShot") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.bubblesShot ?? '', "bubblesShot") }}
                                </div>
                            </div>
                            <div class="row" key="bubblesPerSecond">
                                <div class="col">{{ getFullName("bubblesPerSecond") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.bubblesPerSecond ?? '',
                                    "bubblesPerSecond") }}</div>
                            </div>
                            <div class="row" key="clear3">
                                <div class="col">{{ getFullName("clear3") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.clear3 ?? '', "clear3") }}</div>
                            </div>
                            <div class="row" key="clear4">
                                <div class="col">{{ getFullName("clear4") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.clear4 ?? '', "clear4") }}</div>
                            </div>
                            <div class="row" key="clear5">
                                <div class="col">{{ getFullName("clear5") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.clear5 ?? '', "clear5") }}</div>
                            </div>
                            <div class="row" key="clear3wb">
                                <div class="col">{{ getFullName("clear3wb") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.clear3wb ?? '', "clear3wb") }}</div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="row" key="clear4wb">
                                <div class="col">{{ getFullName("clear4wb") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.clear4wb ?? '', "clear4wb") }}</div>
                            </div>
                            <div class="row" key="clear5wb">
                                <div class="col">{{ getFullName("clear5wb") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.clear5wb ?? '', "clear5wb") }}</div>
                            </div>
                            <div class="row" key="highestBubbleClear">
                                <div class="col">{{ getFullName("highestBubbleClear") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.highestBubbleClear ?? '',
                                    "highestBubbleClear") }}
                                </div>
                            </div>
                            <div class="row" key="wallBounces">
                                <div class="col">{{ getFullName("wallBounces") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.wallBounces ?? '', "wallBounces") }}
                                </div>
                            </div>
                            <div class="row" key="wallBounceClears">
                                <div class="col">{{ getFullName("wallBounceClears") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.wallBounceClears ?? '',
                                    "wallBounceClears") }}</div>
                            </div>
                            <div class="row" key="highestCombo">
                                <div class="col">{{ getFullName("highestCombo") }}</div>
                                <div class="col">{{ formatFieldValue(resultStats.highestCombo ?? '', "highestCombo") }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="isNetworkEval">
                <button @click="closeNetworkEvaluation()">Result Screen</button>
                <NetworkEvaluation />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PAGE_STATE } from '@/ts/page/e/page.e-page-state';
import { PropType, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import Game from '@/pages/game/Game.vue';
import Leaderboard from '@/globalComponents/Leaderboard.vue';
import History from '@/globalComponents/History.vue';
import LineChart from '@/globalComponents/LineChart.vue';
import MenuBackButtons from '@/globalComponents/MenuBackButtons.vue';
import { leaveGame, playerGameInstance, playerGameVisuals, setupSprintGame, startGame } from '@/ts/game/game.master';
import { goToState } from '@/ts/page/page.page-manager';
import { formatTimeNumberToString } from '@/ts/game/visuals/game.visuals.stat-display';
import { formatDateTime, formatDateToAgoText } from '@/ts/page/page.page-utils';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/e/page.e-leaderboard';
import { formatFieldValue, getFullName } from '@/ts/page/i/page.i.stat-display';
import { triggerConfettiAnimation } from '@/ts/page/page.visuals';
import { getSprintDifferenceToPB, getSprintRecord } from '@/ts/page/page.page-requests';
import { disableBackInputs, disableResetInput, enableBackInputs, enableResetInput } from '@/ts/input/input.input-manager';
import { backInput, resetInput } from '@/ts/input/input.all-inputs';
import eventBus from '@/ts/page/page.event-bus';
import { UserData } from '@/ts/page/i/page.i.user-data';
import { GameStats } from '@/ts/game/i/game.i.game-stats';
import { BackButtonData } from './i/i-buttonData';
import { transitionDashboardToResultView, transitionEndScreenPageToDashboard, transitionOutOfGame, transitionToGame } from '@/ts/page/page.css-transitions';
import { playSound, playSoundtrack, stopSoundtrack } from '@/ts/asset/asset.howler-load';
import NetworkEvaluation from '@/pages/game/NetworkEvaluation.vue';

export default defineComponent({
    name: 'GameModeLayout',
    components: { Game, Leaderboard, History, LineChart, MenuBackButtons, NetworkEvaluation },
    props: {
        backButtonData: {
            type: Array as PropType<BackButtonData[]>,
            required: true,
        },
        gameMode: {
            type: String as PropType<GameMode>,
            required: true,
            validator: (value: string): boolean => Object.values(GameMode).includes(value as GameMode),
        },
        leaderboardFields: {
            type: Array as PropType<string[]>,
            required: true,
        },
        leaderboardSortByField: {
            type: String as PropType<string>,
            required: true,
        },
    },
    setup(props) {
        const specialBackButtonBehavior = ref(false);
        const currentLeaderboard = ref<string>('Global');
        const leaderboardTabs = ref<string[]>(['Global', 'National', 'Me']);
        const isGaming = ref<boolean>(false);
        const isDashboard = ref<boolean>(true);
        const isResultView = ref<boolean>(false);
        const isNetworkEval = ref<boolean>(false);
        const resultStats = ref<Partial<GameStats>>();
        const userData: UserData | null = eventBus.getUserData();
        const isGuestString = sessionStorage.getItem('isGuest');
        const isGuest = Boolean(isGuestString && isGuestString.toLowerCase() === 'true');
        const backInputOnLoad = ref<() => void>(() => "");
        const diffToPb = ref<number | undefined>(0);
        const hideRetryButton = ref<boolean>(false);
        const sprintRecordDate = ref<string>('');

        onUnmounted(() => {
            eventBus.off("sprintVictory");
            eventBus.off("leaderboardRecordClicked");
            eventBus.off("historyRecordClicked");
        });

        onMounted(() => {
            eventBus.on("sprintVictory", transitionToResultView);
            eventBus.on("leaderboardRecordClicked", recordClicked);
            eventBus.on("historyRecordClicked", recordClicked);
            backInputOnLoad.value = backInput.fire;
        });

        function goBack() {
            playSound('menu_back');
            if (isGaming.value) {
                transitionOutOfGame(true, ()=>{
                    disableResetInput();
                    disableBackInputs();
                },()=>{
                    leaveGame();
                    showDashboard();
                    playSoundtrack("menu_soundtrack");
                    backInput.fire = backInputOnLoad.value;
                }, () => {
                    enableBackInputs();
                    disableResetInput();
                    resetInput.fire = play;
                });
            }
            if (isResultView.value) {
                transitionEndScreenPageToDashboard('.gameMode-dashboard', '.gameComplete', () => {
                    disableResetInput();
                    disableBackInputs();
                    showDashboard();
                    isResultView.value = true;
                }, ()=>{
                    backInput.fire = backInputOnLoad.value;
                    enableBackInputs();
                    isResultView.value = false;
                });
            }
        }

        function transitionToResultView() {
            sprintRecordDate.value = "";
            transitionOutOfGame(false, ()=>{
                disableResetInput();
                disableBackInputs();
            },()=>{
                showResultView(playerGameInstance.stats);
                playSoundtrack("menu_soundtrack");
            },()=>{
                enableBackInputs();
                enableResetInput();
                resetInput.fire = play;
            });
        }

        function play() {
            playSound('button_play');
            stopSoundtrack();
            backInput.fire = goBack;
            transitionToGame(() => {
                startGame();
            },()=>{
                setupSprintGame();
                showGameView();
            });
        }

        async function showDashboard() {
            disableResetInput();
            isGaming.value = false;
            isDashboard.value = true;
            isResultView.value = false;
            specialBackButtonBehavior.value = false;
            hideRetryButton.value = false;
        }

        function showGameView() {
            isGaming.value = true;
            isDashboard.value = false;
            isResultView.value = false;
            specialBackButtonBehavior.value = false;
            hideRetryButton.value = false;
        }

        async function showResultView(stats: Partial<GameStats>, isRun = true) {
            isResultView.value = true;
            isGaming.value = false;
            isDashboard.value = false;
            resultStats.value = stats;
            if(!isGuest){
                if (resultStats.value.gameDuration !== undefined) {
                    diffToPb.value = await getSprintDifferenceToPB(resultStats.value.gameDuration);
                }
                if (diffToPb.value === 0 && isRun) {
                    triggerConfettiAnimation(".page-container");
                }
            }else{
                diffToPb.value = undefined;
            }
            specialBackButtonBehavior.value = true;
        }

        function openNetworkEvaluation() {
            disableResetInput();
            isGaming.value = false;
            isDashboard.value = false;
            isResultView.value = false;
            isNetworkEval.value = true;
            specialBackButtonBehavior.value = false;
        }

        function closeNetworkEvaluation() {
            disableResetInput();
            isGaming.value = false;
            isDashboard.value = false;
            isResultView.value = true;
            isNetworkEval.value = false;
            specialBackButtonBehavior.value = false;
        }

        async function recordClicked(id: string) {
            if(props.gameMode === GameMode.Sprint){
                playSound('menu_front');
                const sprint = await getSprintRecord(id);
                sprint["bpsGraph"] = JSON.parse(sprint["bpsGraph"]);
                sprintRecordDate.value = formatDateToAgoText(sprint.submittedAt);
                transitionDashboardToResultView('.gameMode-dashboard', '.gameComplete', () => {
                    disableResetInput();
                    disableBackInputs();
                    showResultView(sprint, false);
                    hideRetryButton.value = true;
                    isDashboard.value = true;
                }, ()=>{
                    enableBackInputs();
                    isDashboard.value = false;
                });
            }
        }

        return {
            PAGE_STATE,
            specialBackButtonBehavior,
            playerGameVisuals,
            goToState,
            play,
            isGaming,
            isDashboard,
            startGame,
            formatDateTime,
            formatTimeNumberToString,
            isGuest,
            GameMode,
            LeaderboardCategory,
            SortDirection,
            userData,
            goBack,
            resultStats,
            formatFieldValue,
            getFullName,
            isResultView,
            diffToPb,
            currentLeaderboard,
            leaderboardTabs,
            playSound,
            openNetworkEvaluation,
            isNetworkEval,
            closeNetworkEvaluation,
            recordClicked,
            getSprintRecord,
            transitionDashboardToResultView,
            hideRetryButton,
            sprintRecordDate,
        };
    },
});
</script>

<style scoped>
.inGame {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}

.gameComplete {
    background-color: rgb(30, 30, 30);
    width: 100%;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
}

.columns {
    display: flex;
    border-bottom: 1px solid white;
    border-top: 1px solid white;
}

.row {
    display: flex;
    border-bottom: 1px solid white;
    padding: 5px 15px;
    justify-content: space-between;
}

.column:first-of-type {
    border-right: 1px solid white;
}

.column:first-of-type .row:last-of-type {
    border: none;
}

.column {
    flex: 1;
}

.gameComplete .top {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
}

.resultValue {
    width: 100%;
    border: 1px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
}

.resultValue .rValue {
    font-size: 450%;
}

.resultValue .diff,
.resultValue .pb {
    position: absolute;
    right: 15px;
    bottom: 15px;
}

.gameComplete .top p {
    margin: unset;
}

.gameComplete .top {
    height: 15%;
}

.gameComplete .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.gameComplete .topbar p {
    font-size: 150%;
    margin: unset;
}

.back-buttons{
    z-index: 1;
}

.page .page-wrapper {
    transform: translateX(0%)
}
</style>