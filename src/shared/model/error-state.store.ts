import { Injectable, signal } from '@angular/core';
import { ProblemDetails } from '@entities/error';

@Injectable({ providedIn: 'root' })
export class ErrorStateStore {
  private readonly _error = signal<ProblemDetails | undefined>(undefined);

  readonly error = this._error.asReadonly();

  set(error: ProblemDetails): void {
    this._error.set(error);
  }

  clear(): void {
    this._error.set(undefined);
  }
}
