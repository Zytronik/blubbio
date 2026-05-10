export interface Lobby {
  id: string;
  name: string;
  lobbyStarted: boolean;
  users: LobbyUser[];
}

export interface LobbyUser {
  clientId: string;
  username: string;
  isHost: boolean;
  isGuest: boolean;
  userId: number;
}