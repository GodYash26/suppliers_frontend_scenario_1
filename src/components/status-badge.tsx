import { SupplierStatus } from '@/types/supplier';
import { cn } from '@/lib/utils';

const config: Record<SupplierStatus, { label: string; className?: string }> = {
  DRAFT: {
    label: 'Draft',
  },
  PENDING_APPROVAL: {
    label: 'Pending Approval',
  },
  APPROVED: {
    label: 'Approved',
  },
  REJECTED: {
    label: 'Rejected',
  },
};

export function StatusBadge({ status }: { status: SupplierStatus }) {
  const { label, className } = config[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {label}
    </span>
  );
}
