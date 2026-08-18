import { Supplier, SupplierRole, UserId } from '@/types/supplier';

interface PermissionUser {
  id: UserId;
  role: SupplierRole;
}


export function getSupplierPermissions(supplier: Supplier, user: PermissionUser) {
  const isCreator = supplier.createdById === user.id;
  const isDraft = supplier.status === 'DRAFT';
  const isPending = supplier.status === 'PENDING_APPROVAL';

  return {
    isCreator,
    canSubmit: user.role === 'REQUESTER' && isDraft,
    canApprove: user.role === 'APPROVER' && isPending && !isCreator,
    canReject: user.role === 'APPROVER' && isPending && !isCreator,
    selfApprovalBlocked: user.role === 'APPROVER' && isPending && isCreator,
  };
}