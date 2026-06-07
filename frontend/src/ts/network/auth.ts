import axios from 'axios';
import type { AuthResponse } from '../_interface/auth';
import { httpClient } from './httpClient';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { usePageStore } from '@/stores/pageStore';
import { useSocketStore } from '@/stores/socketStore';
import { Session } from '@shared/types';
import { transitionPageBackwardsAnimation } from '../cssAnimation/transitionPageBackwards';
import { PAGE } from '../_enum/page';
import { LoginResponseDto } from '@shared/types';
import { useUserStore } from '@/stores/userStore';

export async function checkIfUsernameIsTakenAndValid(username: string): Promise<AuthResponse> {
    try {
        const resp = await httpClient.get('/users/username-available', {
            params: { username },
        });
        return { success: resp.data, errorMsg: '' };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                errorMsg: error.response?.data?.message || 'Registration failed',
            };
        } else {
            return { success: false, errorMsg: 'An unknown error occurred' };
        }
    }
}

export async function loginAsGuest(username: string) {
    sessionStorage.setItem('isGuest', 'true');
    if (username.length < 5) {
        username = generateRandomUsername(6);
    }
    sessionStorage.setItem('guestUsername', username);
    const socketStore = useSocketStore();
    socketStore.reconnectSocket();
}

function generateRandomUsername(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function register(username: string, email: string, password: string, passwordAgain: string): Promise<AuthResponse> {
    if (password !== passwordAgain) {
        return { success: false, errorMsg: 'Passwords do not match' };
    }
    try {
        await httpClient.post('/auth/register', { username, email, password });
        return { success: true, errorMsg: '' };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                errorMsg: error.response?.data?.message || 'Registration failed',
            };
        } else {
            return { success: false, errorMsg: 'An unknown error occurred' };
        }
    }
}

export async function login(username: string, password: string): Promise<AuthResponse> {
    try {
        const response = await httpClient.post<LoginResponseDto>('/auth/login', {
            username,
            password,
        });
        const token = response.data.accessToken;
        if (token) {
            localStorage.setItem('authToken', token);
            const socketStore = useSocketStore();
            socketStore.reconnectSocket();
            return { success: true, errorMsg: '' };
        } else {
            return { success: false, errorMsg: 'No token received' };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                errorMsg: error.response?.data?.message || 'Login failed',
            };
        } else {
            return { success: false, errorMsg: 'An unknown error occurred' };
        }
    }
}

export async function forgotPw(email: string): Promise<AuthResponse> {
    try {
        await httpClient.post('/auth/forgot-password', { email });
        return { success: true, errorMsg: '' };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                errorMsg: error.response?.data?.message || 'Request failed',
            };
        } else {
            return { success: false, errorMsg: 'An unknown error occurred' };
        }
    }
}

export async function changePw(token: string, password: string, passwordAgain: string): Promise<AuthResponse> {
    if (password !== passwordAgain) {
        return { success: false, errorMsg: 'Passwords do not match' };
    }
    try {
        await httpClient.post('/auth/change-password', {
            token,
            password,
        });
        return { success: true, errorMsg: '' };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                errorMsg: error.response?.data?.message || 'Request failed',
            };
        } else {
            return { success: false, errorMsg: 'An unknown error occurred' };
        }
    }
}

export async function verifyResetToken(token: string): Promise<AuthResponse> {
    try {
        await httpClient.post('/auth/verify-token', { token: token });
        return { success: true, errorMsg: '' };
    } catch (error) {
        history.replaceState(null, '', '/');
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                errorMsg: error.response?.data?.message || 'Request failed',
            };
        } else {
            return { success: false, errorMsg: 'An unknown error occurred' };
        }
    }
}

export function checkUserAuthentication(): boolean {
    const pageStore = usePageStore();
    const token = localStorage.getItem('authToken');
    const isGuest = sessionStorage.getItem('isGuest') === 'true';

    if (token) {
        try {
            const decodedToken = jwtDecode<JwtPayload>(token);
            const isExpired = decodedToken?.exp ? decodedToken.exp < Date.now() / 1000 : true;

            if (isExpired) {
                pageStore.setLoginStatus(false);
                clearClientState();
                return false;
            }

            pageStore.setLoginStatus(true);
            return true;
        } catch (error) {
            pageStore.setLoginStatus(false);
            clearClientState();
            return false;
        }
    } else if (isGuest) {
        pageStore.setLoginStatus(true);
        return true;
    } else {
        pageStore.setLoginStatus(false);
        clearClientState();
        return false;
    }
}

export function clearClientState() {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
}

export async function logUserOut() {
    const userStore = useUserStore();
    userStore.clearUser();
    const pageStore = usePageStore();
    clearClientState();
    transitionPageBackwardsAnimation(PAGE.startMenu);
    pageStore.setLoginStatus(false);
    const socketStore = useSocketStore();
    socketStore.reconnectSocket();
}

export function isGuestOrLoggedIn(userSession: Session): boolean {
    if (userSession.role === 'guest' || userSession.role === 'user') {
        return true;
    }
    return false;
}

export function isLoggedIn(userSession: Session): boolean {
    if (userSession.role === 'user') {
        return true;
    }
    return false;
}
