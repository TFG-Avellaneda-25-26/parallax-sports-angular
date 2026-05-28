import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthTransitionStore } from '../../store/auth-transition.store';

@Component({
  selector: 'app-auth-transition-overlay',
  imports: [],
  templateUrl: './auth-transition-overlay.component.html',
  styleUrl: './auth-transition-overlay.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthTransitionOverlayComponent {
  protected readonly transitionStore = inject(AuthTransitionStore);
}
