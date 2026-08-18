import { Badge } from '@/components/ui/badge';
import { SupplierStatus } from '@/types/supplier';

const config: Record<SupplierStatus, { label: string; className: string }> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  PENDING_APPROVAL: {
    label: 'Pending Approval',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

export function StatusBadge({ status }: { status: SupplierStatus }) {
  const { label, className } = config[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}