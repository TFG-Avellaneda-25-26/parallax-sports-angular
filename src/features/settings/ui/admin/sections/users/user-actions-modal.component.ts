import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AdminUserDetails, AdminUserService, UserRole } from '@entities/admin-user';

@Component({
  selector: 'app-user-actions-modal',
  standalone: true,
  imports: [],
  templateUrl: './user-actions-modal.component.html',
  styleUrl: './user-actions-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActionsModalComponent {
  private readonly service = inject(AdminUserService);

  readonly user = input.required<AdminUserDetails>();
  readonly closed = output<{ refreshed: boolean }>();

  protected readonly busy = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly current = signal<AdminUserDetails | null>(null);

  protected close(refreshed = false): void {
    this.closed.emit({ refreshed });
  }

  protected async changeEmail(newEmail: string): Promise<void> {
    const d = this.activeUser();
    if (!d || !newEmail || newEmail === d.email) return;
    await this.runAction(() => lastValueFrom(this.service.changeEmail(d.id, newEmail)));
  }

  protected async changeDisplayName(newName: string): Promise<void> {
    const d = this.activeUser();
    if (!d || !newName || newName === d.displayName) return;
    await this.runAction(() => lastValueFrom(this.service.changeDisplayName(d.id, newName)));
  }

  protected async markVerified(): Promise<void> {
    const d = this.activeUser();
    if (!d || d.emailVerified) return;
    await this.runAction(() => lastValueFrom(this.service.markVerified(d.id)));
  }

  protected async setRole(role: UserRole): Promise<void> {
    const d = this.activeUser();
    if (!d || d.role === role) return;
    await this.runAction(() => lastValueFrom(this.service.changeRole(d.id, role)));
  }

  protected async deleteUser(): Promise<void> {
    const d = this.activeUser();
    if (!d) return;
    if (!confirm(`Permanently delete ${d.email}? This cascades all of their data.`)) return;
    this.busy.set(true);
    this.errorMessage.set(null);
    try {
      await lastValueFrom(this.service.delete(d.id));
      this.closed.emit({ refreshed: true });
    } catch {
      this.errorMessage.set('Failed to delete user.');
    } finally {
      this.busy.set(false);
    }
  }

  protected activeUser(): AdminUserDetails {
    return this.current() ?? this.user();
  }

  private async runAction(op: () => Promise<unknown>): Promise<void> {
    const d = this.activeUser();
    if (!d) return;
    this.busy.set(true);
    this.errorMessage.set(null);
    try {
      await op();
      const refreshed = await lastValueFrom(this.service.get(d.id));
      this.current.set(refreshed);
    } catch {
      this.errorMessage.set('Action failed. Please try again.');
    } finally {
      this.busy.set(false);
    }
  }
}
