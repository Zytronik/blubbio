<template>
  <div class="leaderboard-wrapper">
    <div v-if="loading" class="loader"></div>
    <div class="leaderboard" v-if="leaderboard.length">
      <div class="head">
        <div class="row">
          <div class="cell"></div>
          <div class="cell">Username</div>
          <div class="cell" v-for="field in orderedFields" :key="field">
            <span>{{ getFullName(field) }}</span>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="row" v-for="(entry, index) in leaderboard" :key="index"
          :class="{ 'me': entry.userId === userData?.id }">
          <div class="cell">
            <p>#{{ index + 1 }}</p>
          </div>
          <div class="cell">
            <div class="user-info" @click="openProfile(entry.user.username)">
              <img :src="entry.user.pbUrl ? entry.user.pbUrl : getDefaultProfilePbURL()" alt="flag" width="30"
                height="30" />
              <p>{{ truncateString(entry.user.username, 10).toUpperCase() }}</p>
            </div>
          </div>
          <div class="cell" v-for="field in orderedFields" :key="field">
            <p>{{ formatFieldValue(entry[field], field) }}</p>
          </div>
        </div>
      </div>
    </div>
    <p v-if="noEntries">No entries found.</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import { httpClient } from '@/ts/networking/networking.http-client';
import { GameMode, LeaderboardCategory, SortDirection } from '@/ts/page/e/page.e-leaderboard';
import { checkUserAuthentication } from '@/ts/networking/networking.auth';
import eventBus from '@/ts/page/page.event-bus';
import { UserData } from '@/ts/page/i/page.i.user-data';
import { GameStats } from '@/ts/game/i/game.i.game-stats';
import { getDefaultProfilePbURL } from '@/ts/networking/paths';
import { formatFieldValue, getFullName } from '@/ts/page/i/page.i.stat-display';
import { openProfile } from '@/ts/page/page.page-manager';
import { truncateString } from '@/ts/page/page.page-utils';

interface LeaderboardEntry extends GameStats {
  user: {
    username: string;
    country: string;
    pbUrl: string;
    id: number;
  };
  userId: number;
  submittedAt: string;
  // eslint-disable-next-line
  [key: string]: any;
}

export default defineComponent({
  name: 'LeaderboardComponent',
  props: {
    gameMode: {
      type: String as PropType<GameMode>,
      required: true,
      validator: (value: string): boolean => Object.values(GameMode).includes(value as GameMode),
    },
    fields: {
      type: Array as PropType<string[]>,
      required: true,
    },
    sortBy: {
      type: String,
      required: true,
    },
    sortDirection: {
      type: String,
      required: false,
      validator: (value: string): boolean => Object.values(SortDirection).includes(value as SortDirection),
      default: SortDirection.Desc,
    },
    leaderboardCategory: {
      type: String,
      required: true,
      validator: (value: string): boolean => Object.values(LeaderboardCategory).includes(value as LeaderboardCategory),
    },
    country: {
      type: String,
      required: false,
    },
    limit: {
      type: Number,
      default: 20,
    },
  },
  setup(props) {
    const leaderboard = ref<LeaderboardEntry[]>([]);
    const loading = ref<boolean>(true);
    const noEntries = ref<boolean>(false);
    const userData: UserData | null = eventBus.getUserData();
    const isLoggedIn = computed(() => checkUserAuthentication() && !sessionStorage.getItem('isGuest'));
    const orderedFields = computed(() => {
      const fieldsWithoutSortBy = props.fields.filter(field => field !== props.sortBy);
      return [props.sortBy, ...fieldsWithoutSortBy];
    });

    async function fetchLeaderboardData() {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const response = await httpClient.get("/leaderboard/data", {
          params: {
            gameMode: props.gameMode,
            sortBy: props.sortBy,
            sortDirection: props.sortDirection,
            category: props.leaderboardCategory,
            country: props.country,
            limit: props.limit,
          },
          headers: headers
        });

        leaderboard.value = response.data;
        loading.value = false;
        noEntries.value = !leaderboard.value.length;
      } catch (error) {
        noEntries.value = true;
        console.error("Failed to fetch leaderboard data: ", error);
        loading.value = false;
      }
    }

    onMounted(async () => {
      await fetchLeaderboardData();
    });

    return {
      leaderboard,
      orderedFields,
      loading,
      getDefaultProfilePbURL,
      isLoggedIn,
      userData,
      formatFieldValue,
      getFullName,
      noEntries,
      openProfile,
      truncateString,
    };
  },
});
</script>

<style scoped>
.leaderboard {
  height: 100%;
  width: 100%;
}

.leaderboard-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

p {
  margin: unset;
}

.me {
  background-color: rgba(149, 149, 149, 0.3);
}

.row {
  display: flex;
  flex-direction: row;
  text-align: center;
}

.head {
  display: none;
}

.row .cell:first-of-type {
  flex: 0.3;
  padding: 0 10px;
  text-align: left;
}

.row .cell:nth-of-type(2) {
  flex: 1.8;
  text-align: left;
}

.row:nth-of-type(1) .cell:first-of-type p {
  color: gold;
}

.row:nth-of-type(2) .cell:first-of-type p {
  color: silver;
}

.row:nth-of-type(3) .cell:first-of-type p {
  color: #CD7F32;
}

.row:nth-of-type(4) {
  border-top: 1px solid white;
}

.cell {
  flex: 1;
  padding: 10px 0px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.cell > p {
  width: 100%;
}

.cell:last-of-type > p {
  padding-right: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-info img {
  object-fit: cover;
}

.user-info:hover p {
  transition: 200ms;
}

.user-info:hover p {
  opacity: 0.7;
}
</style>@/ts/game/logic/i/game.i.game-stats