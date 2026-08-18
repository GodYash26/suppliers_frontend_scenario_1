'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSuppliers } from '@/hooks/useSuppliers';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, RefreshCw, PackageOpen, ExternalLink } from 'lucide-react';
import { getErrorMessage } from '@/lib/get-error-message';
import { Supplier } from '@/types/supplier';
import CreateSupplierDialog from './supplier-form';

function filterSuppliers(suppliers: Supplier[], query: string): Supplier[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return suppliers;

  return suppliers.filter(
    (supplier) =>
      supplier.companyName.toLowerCase().includes(normalized) ||
      supplier.vatId.toLowerCase().includes(normalized),
  );
}

export default function SuppliersTable() {
  const router = useRouter();
  const { data: suppliers, isLoading, isError, error, refetch } = useSuppliers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuppliers = useMemo(
    () => (suppliers ? filterSuppliers(suppliers, searchQuery) : []),
    [suppliers, searchQuery],
  );

  const navigateToSupplier = (id: string) => {
    router.push(`/suppliers/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage supplier registration and approval workflows
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          New Supplier
        </Button>
      </div>

      <CreateSupplierDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {isError && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{getErrorMessage(error)}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search by company name or VAT ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          className="w-full sm:max-w-sm bg-transparent"
          aria-label="Search suppliers by company name or VAT ID"
        />
        {searchQuery.trim() && suppliers && (
          <p className="text-sm text-gray-500">
            {filteredSuppliers.length} of {suppliers.length} supplier
            {suppliers.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-600 uppercase text-xs tracking-wider">Company</TableHead>
              <TableHead className="font-semibold text-gray-600 uppercase text-xs tracking-wider">VAT ID</TableHead>
              <TableHead className="font-semibold text-gray-600 uppercase text-xs tracking-wider">Country</TableHead>
              <TableHead className="font-semibold text-gray-600 uppercase text-xs tracking-wider">Status</TableHead>
              <TableHead className="font-semibold text-gray-600 uppercase text-xs tracking-wider">Created by</TableHead>
              <TableHead className="text-right font-semibold text-gray-600 uppercase text-xs tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && !isError && suppliers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <PackageOpen className="w-7 h-7 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">No suppliers found</p>
                      <p className="text-xs text-gray-400 mt-1">Get started by creating your first supplier</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1"
                      onClick={() => setDialogOpen(true)}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Create Supplier
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              suppliers &&
              suppliers.length > 0 &&
              filteredSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                      <p className="text-sm font-medium text-gray-600">No matching suppliers</p>
                      <p className="text-xs text-gray-400">
                        Try a different company name or VAT ID
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear search
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

            {!isLoading &&
              !isError &&
              filteredSuppliers.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigateToSupplier(supplier.id)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigateToSupplier(supplier.id);
                  }}
                >
                  <TableCell>
                    <span className="font-medium text-gray-900">
                      {supplier.companyName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                      {supplier.vatId}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{supplier.country}</TableCell>
                  <TableCell>
                    <StatusBadge status={supplier.status} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{supplier.createdBy}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/suppliers/${supplier.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 bg-white text-gray-900 border-gray-200 shadow-none hover:bg-gray-50 hover:text-gray-900"
                      >
                        View
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {suppliers && suppliers.length > 0 && !searchQuery.trim() && (
        <p className="text-xs text-gray-400 text-right">
          {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''} total
        </p>
      )}
    </div>
  );
}
