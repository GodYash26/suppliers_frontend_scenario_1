'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/status-badge';
import { useSupplier } from '@/hooks/useSuppliers';
import { useUser } from '@/context/user-context';
import { getErrorMessage } from '@/lib/get-error-message';
import { SupplierActions } from './supplier-actions';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b py-3 last:border-b-0 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

export function SupplierDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { user } = useUser();
  const { data: supplier, isLoading, isError, error, refetch } = useSupplier(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (isError || !supplier) {
    return (
      <div className="space-y-4">
        <Link href="/suppliers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1" />
            Suppliers
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{getErrorMessage(error)}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/suppliers">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-1" />
          Suppliers
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{supplier.companyName}</CardTitle>
          <CardDescription>Supplier approval workflow details</CardDescription>
          <CardAction>
            <StatusBadge status={supplier.status} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <dl>
            <DetailRow label="Company Name" value={supplier.companyName} />
            <DetailRow label="VAT ID" value={supplier.vatId} />
            <DetailRow label="Country" value={supplier.country} />
            <DetailRow label="Contact Email" value={supplier.contactEmail} />
            <DetailRow label="Status" value={<StatusBadge status={supplier.status} />} />
            <DetailRow label="Created By" value={supplier.createdBy} />
            <DetailRow
              label="Created At"
              value={format(new Date(supplier.createdAt), 'dd MMM yyyy, HH:mm')}
            />
            {supplier.approvedBy && <DetailRow label="Approved By" value={supplier.approvedBy} />}
            {supplier.rejectedBy && <DetailRow label="Rejected By" value={supplier.rejectedBy} />}
            {supplier.rejectionReason && (
              <DetailRow label="Rejection Reason" value={supplier.rejectionReason} />
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Available actions depend on your role and this supplier&apos;s status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierActions supplier={supplier} user={user} />
        </CardContent>
      </Card>
    </div>
  );
}