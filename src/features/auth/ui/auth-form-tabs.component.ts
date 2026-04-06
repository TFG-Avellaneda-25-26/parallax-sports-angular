import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormMode } from '../model/auth.types';

@Component({
  selector: 'app-auth-form-tabs',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './auth-form-tabs.component.css',
  template: `
    <div class="tabs-container">
      <button 
        class="tab-button" 
        [class.active]="currentMode === 'login'"
        (click)="onModeChange('login')"
      >
        Login
      </button>
      <button 
        class="tab-button" 
        [class.active]="currentMode === 'register'"
        (click)="onModeChange('register')"
      >
        Registro
      </button>
    </div>
  `,
})
export class AuthFormTabsComponent {
  @Input() currentMode: FormMode = 'login';
  @Output() modeChange = new EventEmitter<FormMode>();

  onModeChange(mode: FormMode): void {
    if (mode !== this.currentMode) {
      this.modeChange.emit(mode);
    }
  }
}
