'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useApproveSupplier,
  useRejectSupplier,
  useSubmitSupplier,
} from '@/hooks/useSuppliers';
import { getErrorMessage } from '@/lib/get-error-message';
import { getSupplierPermissions } from '@/lib/supplier-permissions';
import { Supplier, SupplierRole, UserId } from '@/types/supplier';
import {
  rejectSupplierSchema,
  RejectSupplierFormValues,
} from '@/validations/supplier.validations';

interface SupplierActionsProps {
  supplier: Supplier;
  user: { id: UserId; role: SupplierRole };
}

export function SupplierActions({ supplier, user }: SupplierActionsProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const permissions = getSupplierPermissions(supplier, user);

  const submitMutation = useSubmitSupplier();
  const approveMutation = useApproveSupplier();
  const rejectMutation = useRejectSupplier();
  const pending =
    submitMutation.isPending || approveMutation.isPending || rejectMutation.isPending;

  const form = useForm<RejectSupplierFormValues>({
    resolver: zodResolver(rejectSupplierSchema),
    defaultValues: { reason: '' },
  });

  const handleSubmitSupplier = async () => {
    try {
      await submitMutation.mutateAsync(supplier.id);
      toast.success('Supplier submitted for approval');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({ id: supplier.id, actingUserId: user.id });
      toast.success('Supplier approved');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleReject = async (values: RejectSupplierFormValues) => {
    try {
      await rejectMutation.mutateAsync({
        id: supplier.id,
        actingUserId: user.id,
        reason: values.reason,
      });
      toast.success('Supplier rejected');
      form.reset();
      setRejectOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const hasWorkflowAction =
    permissions.canSubmit || permissions.canApprove || permissions.canReject;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {permissions.canSubmit && (
        <Button size="sm" variant="secondary" disabled={pending} onClick={handleSubmitSupplier}>
          {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
          Submit for Approval
        </Button>
      )}

      {permissions.canApprove && (
        <Button size="sm" disabled={pending} onClick={handleApprove}>
          {approveMutation.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
          Approve
        </Button>
      )}

      {permissions.canReject && (
        <Button size="sm" variant="destructive" disabled={pending} onClick={() => setRejectOpen(true)}>
          Reject
        </Button>
      )}

      {!hasWorkflowAction && permissions.selfApprovalBlocked && (
        <p className="text-sm text-muted-foreground">
          You created this supplier, so you cannot approve or reject it yourself.
        </p>
      )}

      {!hasWorkflowAction && !permissions.selfApprovalBlocked && (
        <p className="text-sm text-muted-foreground">No actions available for your role.</p>
      )}

      <Dialog
        open={rejectOpen}
        onOpenChange={(open) => {
          setRejectOpen(open);
          if (!open) form.reset();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Supplier</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {supplier.companyName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleReject)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`reject-reason-${supplier.id}`}>Rejection reason</Label>
              <Textarea
                id={`reject-reason-${supplier.id}`}
                placeholder="VAT information could not be verified."
                aria-invalid={!!form.formState.errors.reason}
                {...form.register('reason')}
              />
              {form.formState.errors.reason && (
                <p className="text-xs text-destructive">{form.formState.errors.reason.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={rejectMutation.isPending}
                onClick={() => setRejectOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={rejectMutation.isPending}>
                {rejectMutation.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                Reject Supplier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}