export interface SportEvent {
  id: number;
  sportKey: string;
  sportName: string;
  eventType: string;
  name: string;
  status: string;
  startTimeUtc: string;
  endTimeUtc: string | null;
  competitionName: string | null;
  venueName: string | null;
  participants: EventParticipant[];
  logos: string[];
}

export interface EventParticipant {
  id: number;
  name: string;
  shortName: string | null;
  side: string | null;
}

export interface EventFeedResponse {
  items: SportEvent[];
  nextCursor: number | null;
  hasMore: boolean;
}
