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
import { UserActionsModalComponent } from './user-actions-modal.component';

interface SearchFilters {
  q: string;
  role: '' | UserRole;
  emailVerified: '' | 'true' | 'false';
}

const EMPTY_FILTERS: SearchFilters = { q: '', role: '', emailVerified: '' };
const PAGE_SIZE = 25;

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [UserActionsModalComponent],
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

  protected readonly modalUser = signal<AdminUserDetails | null>(null);
  protected readonly modalError = signal<string | null>(null);
  protected readonly modalLoadingFor = signal<number | null>(null);

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

  protected async openUser(id: number): Promise<void> {
    this.modalError.set(null);
    this.modalLoadingFor.set(id);
    try {
      const details = await lastValueFrom(this.service.get(id));
      this.modalUser.set(details);
    } catch {
      this.modalError.set('Failed to load user details.');
    } finally {
      this.modalLoadingFor.set(null);
    }
  }

  protected async onModalClosed(event: { refreshed: boolean }): Promise<void> {
    this.modalUser.set(null);
    if (event.refreshed) await this.search();
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
