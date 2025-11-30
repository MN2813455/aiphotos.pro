
import { User } from '../types';

const USER_STORAGE_KEY = 'aiphotos_user_v1';

export const getCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const loginWithGoogle = async (): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const mockUser: User = {
    id: 'user_12345',
    name: 'Studio Photographer',
    email: 'photographer@example.com',
    avatarUrl: 'https://ui-avatars.com/api/?name=Studio+Photographer&background=1c1917&color=fff'
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
  return mockUser;
};

export const logout = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};
