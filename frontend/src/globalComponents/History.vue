<template>
  <div class="history-wrapper">
    <div v-if="loading" class="loader"></div>
    <table v-if="historyData.length > 0" class="history">
      <thead>
        <tr>
          <th v-for="field in orderedFields" :key="field"
            @click="updateSort(field)">
            {{ getFullName(field) }}
            <span v-if="sortByVal === field">
              <span v-if="sortDirectionVal === 'asc'">▲</span>
              <span v-else>▼</span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in historyData" :key="index">
          <td v-for="field in orderedFields" :key="field">
            {{ formatFieldValue(entry[field], field) }}
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No history data available.</p>
  </div>
</template>

<script lang="ts">
import { GameStats } from '@/ts/game/i/game.i.game-stats';
import { httpClient } from '@/ts/networking/networking.http-client';
import { GameMode, SortDirection } from '@/ts/page/e/page.e-leaderboard';
import { formatFieldValue, getFullName } from '@/ts/page/i/page.i.stat-display';
import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';

interface HistoryEntry extends GameStats {
  userId: number;
  submittedAt: string;
  // eslint-disable-next-line
  [key: string]: any;
}

export default defineComponent({
  name: 'HistoryComponent',
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
    limit: {
      type: Number,
      default: 20,
    },
  },
  setup(props) {
    const loading = ref(true);
    const historyData = ref<HistoryEntry[]>([]);
    const sortByVal = ref(props.sortBy);
    const sortDirectionVal = ref(props.sortDirection);
    const orderedFields = ref<string[]>([]);

    async function updateSort(newSortBy: string) {
      let newSortDirection = sortDirectionVal.value === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc;
      if (sortByVal.value !== newSortBy) {
        newSortDirection = SortDirection.Asc;
      }
      sortByVal.value = newSortBy;
      sortDirectionVal.value = newSortDirection;
      await fetchHistoryData();
    }

    async function fetchHistoryData() {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const response = await httpClient.get("/" + props.gameMode + "/history", {
          params: {
            sortBy: sortByVal.value,
            sortDirection: sortDirectionVal.value,
            limit: props.limit,
          },
          headers: headers
        });

        historyData.value = response.data;
        loading.value = false;
      } catch (error) {
        console.error("Failed to fetch History data: ", error);
        loading.value = false;
      }
    }

    function sortAndFilterFields() {
      const fieldsWithoutSortBy = props.fields.filter(field => field !== props.sortBy);
      orderedFields.value = [props.sortBy, ...fieldsWithoutSortBy];
    }

    onMounted(async () => {
      await fetchHistoryData();
      sortAndFilterFields();
    });

    watchEffect(() => {
      fetchHistoryData();
    });

    return {
      loading,
      orderedFields,
      historyData,
      getFullName,
      formatFieldValue,
      updateSort,
      sortByVal,
      sortDirectionVal,
    };
  },
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th {
  cursor: pointer;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

td p {
  vertical-align: middle;
  margin: unset;
}

.history {
  width: 100%;
}

.history-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

</style>
@/ts/game/logic/i/game.i.game-stats