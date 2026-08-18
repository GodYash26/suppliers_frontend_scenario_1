'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  createSupplierSchema,
  CreateSupplierFormValues,
} from '@/validations/supplier.validations';
import { useCreateSupplier } from '@/hooks/useSuppliers';
import { useUser } from '@/context/user-context';
import { getErrorMessage } from '@/lib/get-error-message';
import { SupplierServiceError } from '@/lib/mock-supplier-service';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface CreateSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSupplierDialog({
  open,
  onOpenChange,
}: CreateSupplierDialogProps) {
  const { userId } = useUser();
  const { mutateAsync: createSupplier, isPending } = useCreateSupplier();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateSupplierFormValues>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: { companyName: '', vatId: '', country: '', contactEmail: '' },
  });

  const onSubmit = async (values: CreateSupplierFormValues) => {
    try {
      await createSupplier({ ...values, createdById: userId });
      toast.success('Supplier created successfully');
      reset();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof SupplierServiceError && error.code === 'VAT_ID_ALREADY_EXISTS') {
        setError('vatId', { type: 'manual', message: error.message });
      }
      toast.error(getErrorMessage(error));
      // Deliberately no reset() here - FE-03 requires entered data to survive the error.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Supplier</DialogTitle>
          <DialogDescription>
            Fill in the details below. The supplier will be saved as a draft.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Alpha AG"
              aria-invalid={!!errors.companyName}
              {...register('companyName')}
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vatId">VAT ID</Label>
            <Input
              id="vatId"
              placeholder="DE123456789"
              aria-invalid={!!errors.vatId}
              {...register('vatId')}
            />
            {errors.vatId && (
              <p className="text-xs text-destructive">{errors.vatId.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="Germany"
              aria-invalid={!!errors.country}
              {...register('country')}
            />
            {errors.country && (
              <p className="text-xs text-destructive">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contact@alpha.example"
              aria-invalid={!!errors.contactEmail}
              {...register('contactEmail')}
            />
            {errors.contactEmail && (
              <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isPending ? 'Saving...' : 'Save Supplier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}