import { SupplierServiceError } from '@/lib/mock-supplier-service';

export function getErrorMessage(error: unknown): string {
  if (error instanceof SupplierServiceError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}