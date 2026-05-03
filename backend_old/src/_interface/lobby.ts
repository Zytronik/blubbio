export interface Lobby {
  id: string;
  name: string;
  users: LobbyUser[];
  lobbyStarted: boolean;
}

export interface LobbyUser {
  socketId: string;
  username: string;
  isHost: boolean;
  isGuest: boolean;
  userId: number;
}

// Payloads
export interface JoinLobbyPayload {
  lobbyId: string;
}

export interface LeaveLobbyPayload {
  lobbyId: string;
}
