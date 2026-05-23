import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuditLog, AuditLogPage, AuditLogService } from '@entities/audit';

interface FilterState {
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  from: string;
  to: string;
}

const EMPTY_FILTERS: FilterState = {
  actorUserId: '',
  action: '',
  entityType: '',
  entityId: '',
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

  protected async resetFilters(): Promise<void> {
    this.filters.set({ ...EMPTY_FILTERS });
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
      const result = await lastValueFrom(this.service.search({
        actorUserId: f.actorUserId ? Number(f.actorUserId) : null,
        action: f.action || null,
        entityType: f.entityType || null,
        entityId: f.entityId ? Number(f.entityId) : null,
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
}

function toIso(localDateTime: string): string {
  // <input type="datetime-local"> emits "YYYY-MM-DDTHH:mm" without timezone.
  // Append seconds and treat as local time → ISO with offset.
  const d = new Date(localDateTime);
  return Number.isFinite(d.getTime()) ? d.toISOString() : localDateTime;
}
