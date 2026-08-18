import { Supplier, SupplierStatus, UserId, USERS } from '@/types/supplier';

export class SupplierServiceError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'SupplierServiceError';
  }
}

const LATENCY_MS = 400;

let suppliers: Supplier[] = [
  {
    id: 'a1000001-0000-4000-8000-000000000001',
    companyName: 'Sample Ltd.',
    vatId: 'DE123456789',
    country: 'Germany',
    contactEmail: 'contact@sample.example',
    status: 'DRAFT',
    createdBy: USERS.anna.name,
    createdById: USERS.anna.id,
    createdAt: new Date(Date.now() - 86_400_000 * 7).toISOString(),
  },
  {
    id: 'a1000001-0000-4000-8000-000000000002',
    companyName: 'Alpha AG',
    vatId: 'DE987654321',
    country: 'Germany',
    contactEmail: 'contact@alpha.example',
    status: 'PENDING_APPROVAL',
    createdBy: USERS.anna.name,
    createdById: USERS.anna.id,
    createdAt: new Date(Date.now() - 86_400_000 * 5).toISOString(),
  },
  {
    id: 'a1000001-0000-4000-8000-000000000003',
    companyName: 'Ganesh Store',
    vatId: 'NP2435672',
    country: 'Nepal',
    contactEmail: 'info@ganeshstore.np',
    status: 'DRAFT',
    createdBy: USERS.max.name,
    createdById: USERS.max.id,
    createdAt: new Date(Date.now() - 86_400_000 * 3).toISOString(),
  },
  {
    id: 'a1000001-0000-4000-8000-000000000004',
    companyName: 'BrightPath Supplies',
    vatId: 'GB123456789',
    country: 'United Kingdom',
    contactEmail: 'hello@brightpath.co.uk',
    status: 'APPROVED',
    createdBy: USERS.anna.name,
    createdById: USERS.anna.id,
    approvedBy: USERS.max.name,
    approvedById: USERS.max.id,
    createdAt: new Date(Date.now() - 86_400_000 * 14).toISOString(),
  },
  {
    id: 'a1000001-0000-4000-8000-000000000005',
    companyName: 'Nordic Parts Oy',
    vatId: 'FI12345678',
    country: 'Finland',
    contactEmail: 'sales@nordicparts.fi',
    status: 'APPROVED',
    createdBy: USERS.max.name,
    createdById: USERS.max.id,
    approvedBy: USERS.anna.name,
    approvedById: USERS.anna.id,
    createdAt: new Date(Date.now() - 86_400_000 * 10).toISOString(),
  },
  {
    id: 'a1000001-0000-4000-8000-000000000006',
    companyName: 'EuroTech Components',
    vatId: 'FR12345678901',
    country: 'France',
    contactEmail: 'contact@eurotech.fr',
    status: 'PENDING_APPROVAL',
    createdBy: USERS.max.name,
    createdById: USERS.max.id,
    createdAt: new Date(Date.now() - 86_400_000 * 2).toISOString(),
  },
  {
    id: 'a1000001-0000-4000-8000-000000000007',
    companyName: 'Summit Industrial',
    vatId: 'US123456789',
    country: 'United States',
    contactEmail: 'procurement@summitind.com',
    status: 'REJECTED',
    createdBy: USERS.anna.name,
    createdById: USERS.anna.id,
    rejectedBy: USERS.max.name,
    rejectedById: USERS.max.id,
    rejectionReason: 'Incomplete VAT documentation provided.',
    createdAt: new Date(Date.now() - 86_400_000 * 12).toISOString(),
  },
  {
    id: 'a1000001-0000-4000-8000-000000000008',
    companyName: 'Pacific Trade Co.',
    vatId: 'AU12345678901',
    country: 'Australia',
    contactEmail: 'info@pacifictrade.au',
    status: 'REJECTED',
    createdBy: USERS.max.name,
    createdById: USERS.max.id,
    rejectedBy: USERS.anna.name,
    rejectedById: USERS.anna.id,
    rejectionReason: 'Company registration could not be verified.',
    createdAt: new Date(Date.now() - 86_400_000 * 8).toISOString(),
  },
  {
    id: 'a1000001-0000-4000-8000-000000000009',
    companyName: 'Himalayan Exports',
    vatId: 'NP9876543',
    country: 'Nepal',
    contactEmail: 'exports@himalayan.np',
    status: 'DRAFT',
    createdBy: USERS.anna.name,
    createdById: USERS.anna.id,
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: 'a1000001-0000-4000-8000-000000000010',
    companyName: 'Meridian Logistics',
    vatId: 'NL123456789B01',
    country: 'Netherlands',
    contactEmail: 'ops@meridianlogistics.nl',
    status: 'PENDING_APPROVAL',
    createdBy: USERS.anna.name,
    createdById: USERS.anna.id,
    createdAt: new Date(Date.now() - 43_200_000).toISOString(),
  },
];

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function normalizeVatId(vatId: string): string {
  return vatId.trim().toUpperCase();
}

export interface CreateSupplierInput {
  companyName: string;
  vatId: string;
  country: string;
  contactEmail: string;
  createdById: UserId;
}

export const supplierService = {
  async list(): Promise<Supplier[]> {
    return delay([...suppliers]);
  },

  async getById(id: string): Promise<Supplier> {
    const supplier = suppliers.find((s) => s.id === id);
    if (!supplier) {
      throw new SupplierServiceError('SUPPLIER_NOT_FOUND', `No supplier found with id "${id}".`);
    }
    return delay(supplier);
  },

  async create(input: CreateSupplierInput): Promise<Supplier> {
    const companyName = input.companyName.trim();
    const country = input.country.trim();
    const contactEmail = input.contactEmail.trim();
    const vatId = normalizeVatId(input.vatId);

    if (!companyName || !vatId || !country || !contactEmail) {
      throw new SupplierServiceError('VALIDATION_ERROR', 'All fields are required.');
    }

    const duplicate = suppliers.some((s) => normalizeVatId(s.vatId) === vatId);
    if (duplicate) {
      throw new SupplierServiceError(
        'VAT_ID_ALREADY_EXISTS',
        `A supplier with VAT ID "${vatId}" already exists.`,
      );
    }

    const creator = USERS[input.createdById];
    const supplier: Supplier = {
      id: crypto.randomUUID(),
      companyName,
      vatId,
      country,
      contactEmail,
      status: 'DRAFT',
      createdBy: creator.name,
      createdById: creator.id,
      createdAt: new Date().toISOString(),
    };

    suppliers = [supplier, ...suppliers];
    return delay(supplier);
  },

  async submit(id: string): Promise<Supplier> {
    const supplier = await this.getById(id);
    if (supplier.status !== 'DRAFT') {
      throw new SupplierServiceError(
        'INVALID_STATUS_TRANSITION',
        `Only suppliers in DRAFT can be submitted (current status: ${supplier.status}).`,
      );
    }
    return this.transition(id, { status: 'PENDING_APPROVAL' });
  },

  async approve(id: string, actingUserId: UserId): Promise<Supplier> {
    const supplier = await this.getById(id);
    this.assertPendingApproval(supplier);
    this.assertNotSelfActioned(supplier, actingUserId);

    const approver = USERS[actingUserId];
    return this.transition(id, {
      status: 'APPROVED',
      approvedBy: approver.name,
      approvedById: approver.id,
    });
  },

  async reject(id: string, actingUserId: UserId, reason: string): Promise<Supplier> {
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      throw new SupplierServiceError('REJECTION_REASON_REQUIRED', 'A rejection reason is required.');
    }

    const supplier = await this.getById(id);
    this.assertPendingApproval(supplier);
    this.assertNotSelfActioned(supplier, actingUserId);

    const rejector = USERS[actingUserId];
    return this.transition(id, {
      status: 'REJECTED',
      rejectedBy: rejector.name,
      rejectedById: rejector.id,
      rejectionReason: trimmedReason,
    });
  },

  assertPendingApproval(supplier: Supplier): void {
    if (supplier.status !== 'PENDING_APPROVAL') {
      throw new SupplierServiceError(
        'INVALID_STATUS_TRANSITION',
        `Only suppliers in PENDING_APPROVAL can be approved or rejected (current status: ${supplier.status}).`,
      );
    }
  },

  assertNotSelfActioned(supplier: Supplier, actingUserId: UserId): void {
    if (supplier.createdById === actingUserId) {
      throw new SupplierServiceError(
        'SELF_APPROVAL_NOT_ALLOWED',
        'The creator of a supplier cannot approve or reject the same supplier.',
      );
    }
  },

  async transition(id: string, patch: Partial<Supplier> & { status: SupplierStatus }): Promise<Supplier> {
    const index = suppliers.findIndex((s) => s.id === id);
    const updated: Supplier = { ...suppliers[index], ...patch };
    suppliers = [...suppliers.slice(0, index), updated, ...suppliers.slice(index + 1)];
    return delay(updated);
  },
};
