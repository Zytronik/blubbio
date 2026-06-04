export type AuthenticatedRequest = Request & {
    user: {
        uid: string;
        username: string;
    };
}