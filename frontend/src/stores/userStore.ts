import { GetUserProfileResponseDto } from '@/ts/_dto/get-user-profile.response.dto';
import { GetUserRatingResponseDto } from '@/ts/_dto/get-user-rating.response.dto';
import type { Session } from '@/ts/_interface/session';
import { fetchUserProfile, fetchUserRating } from '@/ts/network/user';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userSession: getEmptyUserSession(),
    userRating: null as GetUserRatingResponseDto | null,
    userProfile: null as GetUserProfileResponseDto | null,
  }),
  actions: {
    setUserSession(newSession: Session) {
      this.userSession = {
        ...this.userSession,
        ...newSession,
        currentPage: this.userSession.currentPage || newSession.currentPage,
      }
    },
    updateUserSession(userSession: Session) {
      this.userSession = userSession;
    },
    updateCurrentPage(page: string) {
      this.userSession.currentPage = page;
    },
    clearUser() {
      this.userSession = getEmptyUserSession();
      this.userRating = null;
      this.userProfile = null;
    },
    isGuest() {
      return this.userSession.role === 'guest';
    },
    isUser() {
      return this.userSession.role === 'user';
    },
    getUserSession(): Session {
      return this.userSession;
    },
    getUserName(): string {
      return this.userSession.username;
    },
    async fetchUserProfile(): Promise<void> {
      const userId = this.userSession.userId;

      if (!userId) return;

      const profile = await fetchUserProfile(userId);

      if (profile) {
        this.userProfile = profile;
      }
    },
    async fetchUserRating(): Promise<void> {
      const userId = this.userSession.userId;

      if (!userId) return;

      const rating = await fetchUserRating(userId);

      if (rating) {
        this.userRating = rating;
      }
    },
  }
});

function getEmptyUserSession(): Session {
  return {
    role: null,
    username: '',
    currentPage: '',
    clientId: '',
    userId: null
  }
}