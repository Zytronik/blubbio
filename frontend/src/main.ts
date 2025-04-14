import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import './assets/css/main.css';
import './assets/css/pages.css';
import './assets/css/menus.css';
import './assets/css/all.min.css';
import './assets/css/forms.css';
import './assets/css/community.css';
import './assets/css/leaderboard.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
