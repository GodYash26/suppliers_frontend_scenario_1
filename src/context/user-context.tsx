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
  const [userId, setUserIdState] = useState<UserId>('anna');

  const setUserId = (id: UserId) => {
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