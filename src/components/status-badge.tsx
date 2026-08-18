import { SupplierStatus } from '@/types/supplier';
import { cn } from '@/lib/utils';

const config: Record<SupplierStatus, { label: string; className: string }> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  PENDING_APPROVAL: {
    label: 'Pending Approval',
    className: 'bg-amber-100 text-amber-900 border-amber-200',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-900 border-red-200',
  },
};

export function StatusBadge({ status }: { status: SupplierStatus }) {
  const { label, className } = config[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {label}
    </span>
  );
}
