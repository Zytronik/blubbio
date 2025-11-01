<template>
  <h1>Room Listing</h1>

  <p v-if="lobbies.length === 0">No lobbies available. Create one to get started!</p>

  <ul v-else>
    <li v-for="lobby in lobbies" :key="lobby.id">
      <strong>{{ lobby.name }}</strong> ({{ lobby.lobbyStarted ? 'In Progress' : 'Waiting' }}) - {{ lobby.users.length
      }} user(s)
      <button @click="joinLobby(lobby.id)">Join</button>
    </li>
  </ul>

  <button @click="createLobby">Create Lobby</button>
</template>

<script lang="ts">
import { useLobbyStore } from '@/stores/lobbyStore';
import { computed, onMounted } from 'vue';

export default {
  name: 'RoomListing',
  setup() {
    const lobbyStore = useLobbyStore();
    const lobbies = computed(() => lobbyStore.lobbies);

    onMounted(() => {
      lobbyStore.fetchLobbies();
    });

    function joinLobby(lobbyId: string) {
      lobbyStore.joinLobby(lobbyId);
    }

    function createLobby() {
      lobbyStore.createLobby();
    }

    return {
      lobbies,
      joinLobby,
      createLobby,
    };
  },
};
</script>

<style scoped></style>
