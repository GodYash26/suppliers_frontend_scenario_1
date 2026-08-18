'use client';

import { useUser } from '@/context/user-context';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { USERS, UserId } from '@/types/supplier';

export function Navbar() {
  const { userId, user, setUserId } = useUser();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Supplier Portal</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Acting as</span>
          <Select value={userId} onValueChange={(value) => setUserId(value as UserId)}>
            <SelectTrigger className="w-44" aria-label="Select active user">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(USERS) as UserId[]).map((id) => (
                <SelectItem key={id} value={id}>
                  {USERS[id].name} · {USERS[id].role === 'REQUESTER' ? 'Requester' : 'Approver'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline">{user.role}</Badge>
        </div>
      </div>
    </header>
  );
}