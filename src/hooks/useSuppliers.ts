import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { supplierService, CreateSupplierInput } from '@/lib/mock-supplier-service';
import { Supplier, UserId } from '@/types/supplier';

export const SUPPLIER_KEYS = {
  all: ['suppliers'] as const,
  one: (id: string) => ['supplier', id] as const,
};

/** FE-01: fetch all suppliers. */
export function useSuppliers(options?: Partial<UseQueryOptions<Supplier[], unknown>>) {
  return useQuery<Supplier[], unknown>({
    queryKey: SUPPLIER_KEYS.all,
    queryFn: () => supplierService.list(),
    ...options,
  });
}

/** Fetch a single supplier by id (detail/approval view). */
export function useSupplier(
  id: string,
  options?: Partial<UseQueryOptions<Supplier, unknown>>,
) {
  return useQuery<Supplier, unknown>({
    queryKey: SUPPLIER_KEYS.one(id),
    queryFn: () => supplierService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
}

/** FE-02: create a supplier (always lands in DRAFT). */
export function useCreateSupplier(
  options?: UseMutationOptions<Supplier, unknown, CreateSupplierInput>,
) {
  const qc = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (input: CreateSupplierInput) => supplierService.create(input),
    onSuccess: (data, variables, context, meta) => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      onSuccess?.(data, variables, context, meta);
    },
    ...rest,
  });
}

/** FE-04: DRAFT -> PENDING_APPROVAL. */
export function useSubmitSupplier(
  options?: UseMutationOptions<Supplier, unknown, string>,
) {
  const qc = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (id: string) => supplierService.submit(id),
    onSuccess: (data, id, context, meta) => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.one(id) });
      onSuccess?.(data, id, context, meta);
    },
    ...rest,
  });
}

/** FE-05: PENDING_APPROVAL -> APPROVED (blocked for the creator). */
export function useApproveSupplier(
  options?: UseMutationOptions<Supplier, unknown, { id: string; actingUserId: UserId }>,
) {
  const qc = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: ({ id, actingUserId }: { id: string; actingUserId: UserId }) =>
      supplierService.approve(id, actingUserId),
    onSuccess: (data, variables, context, meta) => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.one(variables.id) });
      onSuccess?.(data, variables, context, meta);
    },
    ...rest,
  });
}

/** FE-06: PENDING_APPROVAL -> REJECTED (reason required, blocked for the creator). */
export function useRejectSupplier(
  options?: UseMutationOptions<
    Supplier,
    unknown,
    { id: string; actingUserId: UserId; reason: string }
  >,
) {
  const qc = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: ({ id, actingUserId, reason }) =>
      supplierService.reject(id, actingUserId, reason),
    onSuccess: (data, variables, context, meta) => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.one(variables.id) });
      onSuccess?.(data, variables, context, meta);
    },
    ...rest,
  });
}