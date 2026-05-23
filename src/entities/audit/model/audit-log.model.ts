export interface AuditLog {
  id: number;
  actorUserId: number | null;
  action: string;
  source: string | null;
  entityType: string | null;
  entityId: number | null;
  detail: Record<string, unknown> | null;
  ipAddress: string | null;
  traceId: string | null;
  createdAt: string;
}

/** Mirrors Spring Data's Page<T> response. */
export interface AuditLogPage {
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface AuditLogFilters {
  actorUserId?: number | null;
  action?: string | null;
  entityType?: string | null;
  entityId?: number | null;
  from?: string | null;
  to?: string | null;
  page?: number;
  size?: number;
}
