import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VerifyEmailService {
  readonly isOpen = signal(false);
  private originRect: DOMRect | null = null;

  open(originRect?: DOMRect | null): void {
    // eslint-disable-next-line no-console
    console.debug('[VerifyEmailService] open() called, route:', window.location.pathname);
    this.originRect = originRect ?? null;
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.originRect = null;
  }

  takeOriginRect(): DOMRect | null {
    return this.originRect;
  }
}
