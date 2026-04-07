export type Sport = 'FORMULA1' | 'BASKETBALL';

export interface SportEvent {
  id: string;
  sport: Sport;
  title: string;
  date: string;
  location: string;
  description?: string;
}

export interface Formula1SessionResponse {
  id: string;
  name: string;
  date: string;
  circuit: string;
  country: string;
}

export interface BasketballGameResponse {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
}
