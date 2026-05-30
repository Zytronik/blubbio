export type Session = {
    role: 'guest' | 'spectator' | 'user' | null;
    username: string;
    currentPage: string;
    clientId: string;
    userId: string | null;
};
