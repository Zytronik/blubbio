import { LobbyUser } from './lobby-user.type';

export type Lobby = {
  id: string;
  name: string;
  users: LobbyUser[];
  lobbyStarted: boolean;
};
