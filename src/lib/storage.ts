import { User } from '@/types';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

export async function getStoredToken(): Promise<string | null> {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Failed to get stored token:', error);
    return null;
  }
}

export async function setStoredToken(token: string): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
}

export async function removeStoredToken(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
}

export async function getStoredUser(): Promise<User | null> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get stored user:', error);
    return null;
  }
}

export async function setStoredUser(user: User): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to store user:', error);
  }
}

export async function removeStoredUser(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Failed to remove user:', error);
  }
}

export async function clearStorage(): Promise<void> {
  await Promise.all([
    removeStoredToken(),
    removeStoredUser(),
  ]);
}