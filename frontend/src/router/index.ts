import { createRouter, createWebHistory } from 'vue-router';
import GameRoute from './routes/Game.vue';
import DebugRoute from './routes/Debug.vue';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: GameRoute,
        },
        {
            path: '/debug',
            component: DebugRoute,
        },
    ],
});