'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
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
    <div className="grid gap-1 border-b border-gray-100 py-3 last:border-b-0 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
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
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !supplier) {
    return (
      <div className="space-y-4">
        <Link href="/suppliers">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Suppliers
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{getErrorMessage(error)}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-1 h-3 w-3" />
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
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Suppliers
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{supplier.companyName}</CardTitle>
              <CardDescription className="mt-1">
                Supplier approval workflow details
              </CardDescription>
            </div>
            <StatusBadge status={supplier.status} />
          </div>
        </CardHeader>
        <CardContent>
          <dl>
            <DetailRow label="Company Name" value={supplier.companyName} />
            <DetailRow
              label="VAT ID"
              value={
                <code className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                  {supplier.vatId}
                </code>
              }
            />
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
          <CardTitle className="text-lg">Actions</CardTitle>
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
