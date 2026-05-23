import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuditLog, AuditLogPage, AuditLogService } from '@entities/audit';
import { AdminUserService } from '@entities/admin-user';

/** Static list of audit actions scraped from the existing @Audited annotations
 *  in the Spring backend. Used to populate the Action input's <datalist>. */
const KNOWN_ACTIONS: string[] = [
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'USER_REGISTERED',
  'USER_EMAIL_CHANGED',
  'USER_PASSWORD_CHANGED',
  'USER_DISPLAY_NAME_CHANGED',
  'USER_SETTINGS_UPDATED',
  'USER_SETTINGS_INITIALIZED',
  'USER_NOTIFICATION_CHANNEL_UPDATED',
  'USER_NOTIFICATION_CHANNEL_DELETED',
  'USER_IDENTITY_DISCONNECTED',
  'USER_ACCOUNT_DELETED',
  'OAUTH_USER_PROVISIONED',
  'OAUTH_IDENTITY_LINKED',
  'TOKEN_REFRESHED',
  'LOGOUT',
  'REFRESH_REUSE_DETECTED',
  'ALERT_CREATED',
  'ADMIN_USER_EMAIL_CHANGED',
  'ADMIN_USER_DISPLAY_NAME_CHANGED',
  'ADMIN_USER_VERIFIED',
  'ADMIN_USER_ROLE_CHANGED',
  'ADMIN_USER_DELETED',
  'ADMIN_EVENT_INJECTED',
  'LOADTEST_START',
  'LOADTEST_STOP',
];

interface FilterState {
  actor: string;        // raw input: integer id OR email substring
  action: string;
  entity: string;       // e.g. "user" or "user#42"
  from: string;
  to: string;
}

const EMPTY_FILTERS: FilterState = {
  actor: '',
  action: '',
  entity: '',
  from: '',
  to: '',
};

const PAGE_SIZE = 50;

@Component({
  selector: 'app-admin-logs',
  imports: [],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsComponent {
  private readonly service = inject(AuditLogService);
  private readonly adminUsers = inject(AdminUserService);

  protected readonly knownActions = KNOWN_ACTIONS;

  protected readonly filters = signal<FilterState>({ ...EMPTY_FILTERS });
  protected readonly page = signal(0);
  protected readonly result = signal<AuditLogPage | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly expandedId = signal<number | null>(null);

  protected readonly rows = computed<AuditLog[]>(() => this.result()?.content ?? []);
  protected readonly totalElements = computed(() => this.result()?.totalElements ?? 0);
  protected readonly totalPages = computed(() => this.result()?.totalPages ?? 0);
  protected readonly isFirst = computed(() => this.result()?.first ?? true);
  protected readonly isLast = computed(() => this.result()?.last ?? true);

  constructor() {
    void this.search();
  }

  protected onFilterChange<K extends keyof FilterState>(key: K, value: string): void {
    this.filters.update(f => ({ ...f, [key]: value }));
  }

  protected async applyFilters(): Promise<void> {
    this.page.set(0);
    await this.search();
  }

  /**
   * Resets every filter. Datetime-local inputs ignore property writes back to
   * empty string in some browsers, so the caller passes the input refs and we
   * clear their DOM `.value` directly.
   */
  protected async resetFilters(fromInput?: HTMLInputElement, toInput?: HTMLInputElement): Promise<void> {
    this.filters.set({ ...EMPTY_FILTERS });
    if (fromInput) fromInput.value = '';
    if (toInput) toInput.value = '';
    this.page.set(0);
    await this.search();
  }

  protected async drillIntoActor(actorUserId: number | null): Promise<void> {
    if (actorUserId == null) return;
    this.filters.update(f => ({ ...f, actor: String(actorUserId) }));
    this.page.set(0);
    await this.search();
  }

  protected async nextPage(): Promise<void> {
    if (this.isLast()) return;
    this.page.update(p => p + 1);
    await this.search();
  }

  protected async prevPage(): Promise<void> {
    if (this.isFirst()) return;
    this.page.update(p => Math.max(0, p - 1));
    await this.search();
  }

  protected toggleExpand(id: number): void {
    this.expandedId.update(current => (current === id ? null : id));
  }

  protected formatDetail(detail: Record<string, unknown> | null): string {
    if (!detail) return '';
    try {
      return JSON.stringify(detail, null, 2);
    } catch {
      return String(detail);
    }
  }

  private async search(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    const f = this.filters();
    try {
      const actorUserId = await this.resolveActor(f.actor);
      const { entityType, entityId } = parseEntity(f.entity);

      const result = await lastValueFrom(this.service.search({
        actorUserId,
        action: f.action || null,
        entityType,
        entityId,
        from: f.from ? toIso(f.from) : null,
        to: f.to ? toIso(f.to) : null,
        page: this.page(),
        size: PAGE_SIZE,
      }));
      this.result.set(result);
    } catch {
      this.errorMessage.set('Failed to load audit logs.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Accepts integer id directly; otherwise resolves email substring → first
   *  matching user id via the admin users endpoint. */
  private async resolveActor(raw: string): Promise<number | null> {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (/^\d+$/.test(trimmed)) return Number(trimmed);
    try {
      const page = await lastValueFrom(this.adminUsers.search({ q: trimmed, page: 0, size: 1 }));
      const first = page.content[0];
      return first ? first.id : -1; // -1 = no match; ensures empty result
    } catch {
      return null;
    }
  }
}

function parseEntity(raw: string): { entityType: string | null; entityId: number | null } {
  if (!raw) return { entityType: null, entityId: null };
  const trimmed = raw.trim();
  const hashIdx = trimmed.indexOf('#');
  if (hashIdx === -1) return { entityType: trimmed, entityId: null };
  const type = trimmed.slice(0, hashIdx).trim();
  const idStr = trimmed.slice(hashIdx + 1).trim();
  const id = Number(idStr);
  return {
    entityType: type || null,
    entityId: Number.isFinite(id) && id > 0 ? id : null,
  };
}

function toIso(localDateTime: string): string {
  const d = new Date(localDateTime);
  return Number.isFinite(d.getTime()) ? d.toISOString() : localDateTime;
}
