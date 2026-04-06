import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';

interface ErrorMessages {
  [key: string]: string;
}

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="form-group">
      <label class="form-label">{{ label }}</label>
      <input 
        [type]="type"
        [placeholder]="placeholder"
        (change)="onValueChange()"
        [ngModel]="control?.value"
        (ngModelChange)="onModelChange($event)"
        class="form-input"
        [class.error]="isFieldInvalid()"
        (blur)="onBlur()"
      />
      @if (isFieldInvalid() && control?.touched) {
        <span class="error-message">
          {{ getErrorMessage() }}
        </span>
      }
    </div>
  `,
  styles: [`
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .form-input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.3s ease;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      &.error {
        border-color: #dc3545;
        
        &:focus {
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
      }
    }

    .error-message {
      font-size: 12px;
      color: #dc3545;
      margin-top: 2px;
    }
  `],
})
export class FormFieldComponent implements OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control: AbstractControl | null = null;
  @Input() errorMessages: ErrorMessages = {};
  @Output() blur = new EventEmitter<void>();

  ngOnInit(): void {
    if (!this.control) {
      console.warn('FormFieldComponent: control is required');
    }
  }

  isFieldInvalid(): boolean {
    return this.control ? this.control.invalid && this.control.touched : false;
  }

  getErrorMessage(): string {
    if (!this.control || !this.control.errors) return '';

    const errorKey = Object.keys(this.control.errors)[0];
    return this.errorMessages[errorKey]
      ? this.errorMessages[errorKey]
      : `Error: ${errorKey}`;
  }

  onBlur(): void {
    this.blur.emit();
  }

  onValueChange(): void {
    // Trigger validation
  }

  onModelChange(value: any): void {
    if (this.control) {
      this.control.setValue(value);
    }
  }
}
