export type LobbyUser = {
  clientId: string;
  username: string;
  isHost: boolean;
  isGuest: boolean;
  userId: string | null;
};
