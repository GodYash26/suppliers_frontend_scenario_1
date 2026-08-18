'use client';

import { useUser } from '@/context/user-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { Building2, Users } from 'lucide-react';
import { USERS, UserId } from '@/types/supplier';

const roleLabels: Record<string, string> = {
  REQUESTER: 'Requester',
  APPROVER: 'Approver',
};

export function Navbar() {
  const { userId, user, setUserId } = useUser();

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-semibold text-base text-gray-900 tracking-tight">
            Supplier Portal
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
            <Users className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-xs font-medium text-gray-500 hidden sm:inline whitespace-nowrap">
              Switch user
            </span>
            <Select value={userId} onValueChange={(value) => setUserId(value as UserId)}>
              <SelectTrigger
                className="h-8 w-36 sm:w-44 border-0 bg-transparent shadow-none px-2 focus:ring-0 text-gray-600"
                aria-label="Select active user"
              >
                <SelectValue placeholder={`${user.name} (${roleLabels[user.role]})`} />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(USERS) as UserId[]).map((id) => (
                  <SelectItem key={id} value={id}>
                    {USERS[id].name} ({USERS[id].role === 'REQUESTER' ? 'Requester' : 'Approver'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-gray-200">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-medium text-gray-600 uppercase shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col items-start ">
              <span className="text-sm font-medium text-gray-900 ">{user.name}</span>
              <div className='text-xs text-black border border-gray-400 rounded-full px-2'>
                {roleLabels[user.role] ?? user.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
