import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiClient } from '@shared/api';
import { AuditLogFilters, AuditLogPage } from '../model/audit-log.model';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly api = inject(ApiClient);

  search(filters: AuditLogFilters) {
    const params = buildParams(filters);
    const query = params.toString();
    const suffix = query ? `?${query}` : '';
    return this.api.get<AuditLogPage>(`/api/admin/audit${suffix}`);
  }
}

function buildParams(filters: AuditLogFilters): HttpParams {
  let params = new HttpParams();
  if (filters.actorUserId != null) params = params.set('actorUserId', String(filters.actorUserId));
  if (filters.action) params = params.set('action', filters.action);
  if (filters.entityType) params = params.set('entityType', filters.entityType);
  if (filters.entityId != null) params = params.set('entityId', String(filters.entityId));
  if (filters.from) params = params.set('from', filters.from);
  if (filters.to) params = params.set('to', filters.to);
  if (filters.page != null) params = params.set('page', String(filters.page));
  if (filters.size != null) params = params.set('size', String(filters.size));
  return params;
}
