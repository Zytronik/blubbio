import type { Pages } from '../_interface/page';
import SoloMenu from '../../pages/SoloMenu.vue';
import Settings from '../../pages/Settings.vue';
import MultiMenu from '../../pages/MultiMenu.vue';
import StartMenu from '../../pages/StartMenu.vue';
import SprintPage from '../../pages/SprintPage.vue';
import ScorePage from '../../pages/ScorePage.vue';
import RankedPage from '../../pages/RankedPage.vue';
import RoomListing from '../../pages/RoomListing.vue';
import { PAGE } from '../_enum/page';
import RoomPage from '@/pages/RoomPage.vue';

export const allPages: Pages = {
    [PAGE.startMenu]: {
        title: 'Home',
        color: 'black',
        component: StartMenu,
        allowedTransitions: [PAGE.soloMenu, PAGE.multiMenu, PAGE.settings, PAGE.roomPage],
    },
    [PAGE.soloMenu]: {
        title: 'Solo Menu',
        color: 'rgb(12, 167, 137)',
        component: SoloMenu,
        allowedTransitions: [PAGE.startMenu, PAGE.soloMenu, PAGE.multiMenu, PAGE.settings, PAGE.sprintPage, PAGE.scorePage, PAGE.roomPage],
        backButtons: [
            {
                page: PAGE.multiMenu,
                iconSrc: require('@/assets/img/icons/multi.png'),
                disabled: true,
            },
            {
                page: PAGE.startMenu,
                iconSrc: require('@/assets/img/icons/solo.png'),
                disabled: false,
            },
            {
                page: PAGE.settings,
                iconSrc: require('@/assets/img/icons/config.png'),
                disabled: true,
            },
        ],
    },
    [PAGE.multiMenu]: {
        title: 'Multi Menu',
        color: 'rgb(218, 0, 99)',
        component: MultiMenu,
        allowedTransitions: [PAGE.startMenu, PAGE.soloMenu, PAGE.multiMenu, PAGE.settings, PAGE.rankedPage, PAGE.roomListing, PAGE.roomPage],
        backButtons: [
            {
                page: PAGE.startMenu,
                iconSrc: require('@/assets/img/icons/multi.png'),
                disabled: false,
            },
            {
                page: PAGE.soloMenu,
                iconSrc: require('@/assets/img/icons/solo.png'),
                disabled: true,
            },
            {
                page: PAGE.settings,
                iconSrc: require('@/assets/img/icons/config.png'),
                disabled: true,
            },
        ],
    },
    [PAGE.settings]: {
        title: 'Settings',
        color: 'rgb(250, 199, 16)',
        component: Settings,
        allowedTransitions: [PAGE.startMenu, PAGE.soloMenu, PAGE.multiMenu, PAGE.settings, PAGE.roomPage],
        backButtons: [
            {
                page: PAGE.multiMenu,
                iconSrc: require('@/assets/img/icons/multi.png'),
                disabled: true,
            },
            {
                page: PAGE.soloMenu,
                iconSrc: require('@/assets/img/icons/solo.png'),
                disabled: true,
            },
            {
                page: PAGE.startMenu,
                iconSrc: require('@/assets/img/icons/config.png'),
                disabled: false,
            },
        ],
    },
    [PAGE.sprintPage]: {
        title: 'Sprint',
        color: 'rgb(29, 179, 157)',
        component: SprintPage,
        allowedTransitions: [PAGE.startMenu, PAGE.soloMenu, PAGE.scorePage, PAGE.roomPage],
        backButtons: [
            {
                page: PAGE.soloMenu,
                iconSrc: require('@/assets/img/icons/sprint.png'),
                disabled: false,
            },
            {
                page: PAGE.scorePage,
                iconSrc: require('@/assets/img/icons/score.png'),
                disabled: true,
            },
        ],
    },
    [PAGE.scorePage]: {
        title: 'Score',
        color: 'rgb(17, 178, 135)',
        component: ScorePage,
        allowedTransitions: [PAGE.startMenu, PAGE.soloMenu, PAGE.sprintPage, PAGE.roomPage],
        backButtons: [
            {
                page: PAGE.sprintPage,
                iconSrc: require('@/assets/img/icons/sprint.png'),
                disabled: true,
            },
            {
                page: PAGE.soloMenu,
                iconSrc: require('@/assets/img/icons/score.png'),
                disabled: false,
            },
        ],
    },
    [PAGE.rankedPage]: {
        title: 'Ranked',
        color: 'rgb(160, 0, 24)',
        component: RankedPage,
        allowedTransitions: [PAGE.startMenu, PAGE.multiMenu, PAGE.roomListing, PAGE.roomPage],
        backButtons: [
            {
                page: PAGE.multiMenu,
                iconSrc: require('@/assets/img/icons/ranked.png'),
                disabled: false,
            },
            {
                page: PAGE.roomListing,
                iconSrc: require('@/assets/img/icons/rooms.png'),
                disabled: true,
            },
        ],
    },
    [PAGE.roomListing]: {
        title: 'Room Listing',
        color: 'rgb(129, 33, 81)',
        component: RoomListing,
        allowedTransitions: [PAGE.startMenu, PAGE.multiMenu, PAGE.rankedPage, PAGE.roomPage],
        backButtons: [
            {
                page: PAGE.rankedPage,
                iconSrc: require('@/assets/img/icons/ranked.png'),
                disabled: true,
            },
            {
                page: PAGE.multiMenu,
                iconSrc: require('@/assets/img/icons/rooms.png'),
                disabled: false,
            },
        ],
    },
    [PAGE.roomPage]: {
        title: 'Room Page',
        color: 'rgb(38, 16, 27)',
        component: RoomPage,
        allowedTransitions: [PAGE.startMenu, PAGE.roomListing],
        backButtons: [
            {
                page: PAGE.roomListing,
                iconSrc: require('@/assets/img/icons/rooms.png'),
                disabled: false,
            },
        ],
    },
};
