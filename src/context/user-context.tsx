'use client';

import { createContext, useContext, useState } from 'react';
import { USERS, UserId } from '@/types/supplier';

interface UserContextType {
  userId: UserId;
  user: (typeof USERS)[UserId];
  setUserId: (id: UserId) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<UserId>(() => {
    if (typeof window === 'undefined') return 'anna';
    const stored = window.localStorage.getItem('userId') as UserId;
    return stored && USERS[stored] ? stored : 'anna';
  });

  const setUserId = (id: UserId) => {
    window.localStorage.setItem('userId', id);
    setUserIdState(id);
  };

  return (
    <UserContext.Provider value={{ userId, user: USERS[userId], setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}