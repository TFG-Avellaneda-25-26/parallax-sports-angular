import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
  AdminUserDetails,
  AdminUserListItem,
  AdminUserPage,
  AdminUserService,
  UserRole,
} from '@entities/admin-user';

interface SearchFilters {
  q: string;
  role: '' | UserRole;
  emailVerified: '' | 'true' | 'false';
}

const EMPTY_FILTERS: SearchFilters = { q: '', role: '', emailVerified: '' };
const PAGE_SIZE = 25;

@Component({
  selector: 'app-admin-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  private readonly service = inject(AdminUserService);

  protected readonly filters = signal<SearchFilters>({ ...EMPTY_FILTERS });
  protected readonly page = signal(0);
  protected readonly result = signal<AdminUserPage | null>(null);
  protected readonly listError = signal<string | null>(null);
  protected readonly isLoading = signal(false);

  protected readonly selectedId = signal<number | null>(null);
  protected readonly detail = signal<AdminUserDetails | null>(null);
  protected readonly detailError = signal<string | null>(null);
  protected readonly detailLoading = signal(false);
  protected readonly actionError = signal<string | null>(null);
  protected readonly actionBusy = signal(false);

  protected readonly rows = computed<AdminUserListItem[]>(() => this.result()?.content ?? []);
  protected readonly totalElements = computed(() => this.result()?.totalElements ?? 0);
  protected readonly totalPages = computed(() => this.result()?.totalPages ?? 0);
  protected readonly isFirst = computed(() => this.result()?.first ?? true);
  protected readonly isLast = computed(() => this.result()?.last ?? true);

  constructor() {
    void this.search();
  }

  protected onFilterChange<K extends keyof SearchFilters>(key: K, value: string): void {
    this.filters.update(f => ({ ...f, [key]: value as SearchFilters[K] }));
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

  protected async prevPage(): Promise<void> {
    if (this.isFirst()) return;
    this.page.update(p => Math.max(0, p - 1));
    await this.search();
  }

  protected async nextPage(): Promise<void> {
    if (this.isLast()) return;
    this.page.update(p => p + 1);
    await this.search();
  }

  protected async select(id: number): Promise<void> {
    this.selectedId.set(id);
    this.detail.set(null);
    this.detailError.set(null);
    this.actionError.set(null);
    this.detailLoading.set(true);
    try {
      this.detail.set(await lastValueFrom(this.service.get(id)));
    } catch {
      this.detailError.set('Failed to load user details.');
    } finally {
      this.detailLoading.set(false);
    }
  }

  protected clearSelection(): void {
    this.selectedId.set(null);
    this.detail.set(null);
    this.detailError.set(null);
    this.actionError.set(null);
  }

  protected async changeEmail(newEmail: string): Promise<void> {
    const d = this.detail();
    if (!d || !newEmail || newEmail === d.email) return;
    await this.runAction(() => lastValueFrom(this.service.changeEmail(d.id, newEmail)));
  }

  protected async changeDisplayName(newName: string): Promise<void> {
    const d = this.detail();
    if (!d || !newName || newName === d.displayName) return;
    await this.runAction(() => lastValueFrom(this.service.changeDisplayName(d.id, newName)));
  }

  protected async markVerified(): Promise<void> {
    const d = this.detail();
    if (!d || d.emailVerified) return;
    await this.runAction(() => lastValueFrom(this.service.markVerified(d.id)));
  }

  protected async setRole(role: UserRole): Promise<void> {
    const d = this.detail();
    if (!d || d.role === role) return;
    await this.runAction(() => lastValueFrom(this.service.changeRole(d.id, role)));
  }

  protected async deleteUser(): Promise<void> {
    const d = this.detail();
    if (!d) return;
    if (!confirm(`Permanently delete ${d.email}? This cascades all of their data.`)) return;
    this.actionBusy.set(true);
    this.actionError.set(null);
    try {
      await lastValueFrom(this.service.delete(d.id));
      this.clearSelection();
      await this.search();
    } catch {
      this.actionError.set('Failed to delete user.');
    } finally {
      this.actionBusy.set(false);
    }
  }

  private async runAction(op: () => Promise<unknown>): Promise<void> {
    const d = this.detail();
    if (!d) return;
    this.actionBusy.set(true);
    this.actionError.set(null);
    try {
      await op();
      await this.select(d.id);
      await this.search();
    } catch {
      this.actionError.set('Action failed. Please try again.');
    } finally {
      this.actionBusy.set(false);
    }
  }

  private async search(): Promise<void> {
    this.isLoading.set(true);
    this.listError.set(null);
    const f = this.filters();
    try {
      this.result.set(await lastValueFrom(this.service.search({
        q: f.q || null,
        role: (f.role || null) as UserRole | null,
        emailVerified: f.emailVerified === '' ? null : f.emailVerified === 'true',
        page: this.page(),
        size: PAGE_SIZE,
      })));
    } catch {
      this.listError.set('Failed to load users.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
