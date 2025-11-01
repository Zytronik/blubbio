export interface Lobby {
  id: string;
  name: string;
  lobbyStarted: boolean;
  users: LobbyUser[];
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

export interface LobbyListResponse {
  lobbies: Lobby[];
}

export interface FailedJoinLobbyResponse {
  lobbyId: string;
}

export interface StartLobbyPayload {
  lobbyId: string;
}
