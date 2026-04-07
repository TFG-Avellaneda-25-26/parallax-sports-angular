import { inject, Injectable } from '@angular/core';
import { ApiClient } from '@shared/api';
import type { Formula1SessionResponse, BasketballGameResponse } from '../model/sport-event.types';

@Injectable({ providedIn: 'root' })
export class SportEventService {
  private readonly api = inject(ApiClient);

  getFormula1Sessions(year: number) {
    return this.api.get<Formula1SessionResponse[]>(`/formula1/sessions/${year}`);
  }

  getBasketballGames() {
    return this.api.get<BasketballGameResponse[]>('/basketball/games');
  }
}
