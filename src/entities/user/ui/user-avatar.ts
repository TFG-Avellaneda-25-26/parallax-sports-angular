import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  template: `
    <div class="avatar">{{ initials() }}</div>
  `,
  styles: `
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-color: var(--avatar-bg, #6366f1);
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
    }
  `,
})
export class UserAvatarComponent {
  username = input.required<string>();

  initials = computed(() => {
    const name = this.username();
    return name.slice(0, 2).toUpperCase();
  });
}
