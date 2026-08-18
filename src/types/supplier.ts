export type SupplierStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED';

export type SupplierRole = 'REQUESTER' | 'APPROVER';

export interface Supplier {
  id: string;
  companyName: string;
  vatId: string;
  country: string;
  contactEmail: string;
  status: SupplierStatus;
  createdBy: string;
  createdById: string;
  createdAt: string;
  approvedBy?: string;
  approvedById?: string;
  rejectedBy?: string;
  rejectedById?: string;
  rejectionReason?: string;
}

export const USERS = {
  anna: { id: 'anna', name: 'Anna', role: 'REQUESTER' },
  max: { id: 'max', name: 'Max', role: 'APPROVER' },
} as const satisfies Record<string, { id: string; name: string; role: SupplierRole }>;

export type UserId = keyof typeof USERS;