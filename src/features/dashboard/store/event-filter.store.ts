import { computed, effect } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { SportEvent } from '@entities/event';

export type FilterLevel = 'sport' | 'competition' | 'eventType' | 'participant';

export interface ParticipantNode {
  id: number;
  sportKey: string;
  competitionName: string;
  name: string;
  count: number;
}

export interface EventTypeNode {
  key: string;
  competitionKey: string;
  type: string;
  count: number;
}

export interface CompetitionNode {
  key: string;
  sportKey: string;
  name: string;
  count: number;
  eventTypes: EventTypeNode[];
  participants: ParticipantNode[];
}

export interface SportNode {
  key: string;
  name: string;
  count: number;
  competitions: CompetitionNode[];
}

export const participantKey = (sportKey: string, competitionName: string, id: number): string =>
  `${sportKey}::${competitionName}::${id}`;

interface EventFilterState {
  includeSports: Set<string>;
  excludeSports: Set<string>;
  includeCompetitions: Set<string>;
  excludeCompetitions: Set<string>;
  includeEventTypes: Set<string>;
  excludeEventTypes: Set<string>;
  includeParticipants: Set<string>;
  excludeParticipants: Set<string>;
}

const STORAGE_KEY = 'parallax.dashboard.filter';

const initialState: EventFilterState = {
  includeSports: new Set(),
  excludeSports: new Set(),
  includeCompetitions: new Set(),
  excludeCompetitions: new Set(),
  includeEventTypes: new Set(),
  excludeEventTypes: new Set(),
  includeParticipants: new Set(),
  excludeParticipants: new Set(),
};

export const competitionKey = (sportKey: string, competitionName: string): string =>
  `${sportKey}::${competitionName}`;

export const eventTypeKey = (sportKey: string, competitionName: string | null, eventType: string): string =>
  `${sportKey}::${competitionName ?? ''}::${eventType}`;

function withAdded<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  next.add(value);
  return next;
}

function withRemoved<T>(set: Set<T>, value: T): Set<T> {
  if (!set.has(value)) return set;
  const next = new Set(set);
  next.delete(value);
  return next;
}

function eventPasses(event: SportEvent, state: EventFilterState): boolean {
  if (state.excludeSports.has(event.sportKey)) return false;

  const anyIncludeActive =
    state.includeSports.size > 0 ||
    state.includeCompetitions.size > 0 ||
    state.includeEventTypes.size > 0 ||
    state.includeParticipants.size > 0;

  const ck = event.competitionName
    ? competitionKey(event.sportKey, event.competitionName)
    : null;
  const etk = eventTypeKey(event.sportKey, event.competitionName, event.eventType);
  const compName = event.competitionName ?? '';

  if (!anyIncludeActive) {
    if (ck && state.excludeCompetitions.has(ck)) return false;
    if (state.excludeEventTypes.has(etk)) return false;
    if (event.participants.some(p =>
      state.excludeParticipants.has(participantKey(event.sportKey, compName, p.id))
    )) return false;
    return true;
  }

  const hasAnyFilterScopedToThisSport =
    state.includeSports.has(event.sportKey) ||
    [...state.includeCompetitions].some(k => k.startsWith(event.sportKey + '::')) ||
    [...state.includeEventTypes].some(k => k.startsWith(event.sportKey + '::')) ||
    [...state.includeParticipants].some(k => k.startsWith(event.sportKey + '::'));

  if (!hasAnyFilterScopedToThisSport) return false;

  if (state.includeSports.has(event.sportKey)) {
    const hasMoreSpecificFilter =
      [...state.includeCompetitions].some(k => k.startsWith(event.sportKey + '::')) ||
      [...state.includeEventTypes].some(k => k.startsWith(event.sportKey + '::')) ||
      [...state.includeParticipants].some(k => k.startsWith(event.sportKey + '::'));

    if (!hasMoreSpecificFilter) {
      if (ck && state.excludeCompetitions.has(ck)) return false;
      if (state.excludeEventTypes.has(etk)) return false;
      if (event.participants.some(p =>
        state.excludeParticipants.has(participantKey(event.sportKey, compName, p.id))
      )) return false;
      return true;
    }
  }

  // competition
  if (ck !== null && state.includeCompetitions.has(ck)) {
    const hasAnyParticipantFilterForThisCompetition =
      [...state.includeParticipants].some(k =>
        k.startsWith(ck + '::')
      );
    const hasAnyEventTypeFilterForThisCompetition =
      [...state.includeEventTypes].some(k => k.startsWith(event.sportKey + '::'));

    if (hasAnyParticipantFilterForThisCompetition) {
      if (event.participants.length === 0) return false;
      const hasParticipantForThisCompetition =
        event.participants.some(p =>
          state.includeParticipants.has(participantKey(event.sportKey, compName, p.id))
        );
      if (!hasParticipantForThisCompetition) return false;
    }

    if (hasAnyEventTypeFilterForThisCompetition) {
      if (!state.includeEventTypes.has(etk)) return false;
    }

    if (state.excludeEventTypes.has(etk)) return false;
    if (event.participants.some(p =>
      state.excludeParticipants.has(participantKey(event.sportKey, compName, p.id))
    )) return false;
    return true;
  }

  // eventType
  if (state.includeEventTypes.has(etk)) {
    if (event.participants.some(p =>
      state.excludeParticipants.has(participantKey(event.sportKey, compName, p.id))
    )) return false;
    return true;
  }

  // participant
  if (event.participants.some(p =>
    state.includeParticipants.has(participantKey(event.sportKey, compName, p.id))
  )) {
    if (state.excludeEventTypes.has(etk)) return false;
    return true;
  }

  return false;
}

export function buildTree(events: SportEvent[]): SportNode[] {
  const sports = new Map<string, {
    key: string;
    name: string;
    count: number;
    competitions: Map<string, {
      key: string;
      sportKey: string;
      competitionName: string;
      name: string;
      count: number;
      eventTypes: Map<string, EventTypeNode>;
      participants: Map<number, ParticipantNode>;
    }>;
  }>();

  for (const ev of events) {
    let sport = sports.get(ev.sportKey);
    if (!sport) {
      sport = { key: ev.sportKey, name: ev.sportName, count: 0, competitions: new Map() };
      sports.set(ev.sportKey, sport);
    }
    sport.count++;

    if (ev.competitionName) {
      const ck = competitionKey(ev.sportKey, ev.competitionName);
      let comp = sport.competitions.get(ck);
      if (!comp) {
        comp = {
          key: ck,
          sportKey: ev.sportKey,
          competitionName: ev.competitionName,
          name: ev.competitionName,
          count: 0,
          eventTypes: new Map(),
          participants: new Map(),
        };
        sport.competitions.set(ck, comp);
      }
      comp.count++;

      const etk = eventTypeKey(ev.sportKey, ev.competitionName, ev.eventType);
      const existingType = comp.eventTypes.get(etk);
      if (existingType) existingType.count++;
      else comp.eventTypes.set(etk, { key: etk, competitionKey: ck, type: ev.eventType, count: 1 });

      for (const p of ev.participants) {
        const existing = comp.participants.get(p.id);
        if (existing) existing.count++;
        else comp.participants.set(p.id, { id: p.id, sportKey: ev.sportKey, competitionName: ev.competitionName, name: p.shortName ?? p.name, count: 1 });
      }
    }
  }

  return [...sports.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(s => ({
      key: s.key,
      name: s.name,
      count: s.count,
      competitions: [...s.competitions.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(c => ({
          key: c.key,
          sportKey: c.sportKey,
          name: c.name,
          count: c.count,
          eventTypes: [...c.eventTypes.values()].sort((a, b) => a.type.localeCompare(b.type)),
          participants: [...c.participants.values()].sort((a, b) => a.name.localeCompare(b.name)),
        })),
    }));
}

function loadFromStorage(): Partial<EventFilterState> {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const asStringSet = (key: string) =>
      Array.isArray(parsed[key]) ? new Set((parsed[key] as unknown[]).filter((v): v is string => typeof v === 'string')) : undefined;

    const result: Partial<EventFilterState> = {};
    const inS = asStringSet('includeSports'); if (inS) result.includeSports = inS;
    const exS = asStringSet('excludeSports'); if (exS) result.excludeSports = exS;
    const inC = asStringSet('includeCompetitions'); if (inC) result.includeCompetitions = inC;
    const exC = asStringSet('excludeCompetitions'); if (exC) result.excludeCompetitions = exC;
    const inET = asStringSet('includeEventTypes'); if (inET) result.includeEventTypes = inET;
    const exET = asStringSet('excludeEventTypes'); if (exET) result.excludeEventTypes = exET;
    const inP = asStringSet('includeParticipants'); if (inP) result.includeParticipants = inP;
    const exP = asStringSet('excludeParticipants'); if (exP) result.excludeParticipants = exP;
    return result;
  } catch {
    return {};
  }
}

function saveToStorage(state: EventFilterState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      includeSports: [...state.includeSports],
      excludeSports: [...state.excludeSports],
      includeCompetitions: [...state.includeCompetitions],
      excludeCompetitions: [...state.excludeCompetitions],
      includeEventTypes: [...state.includeEventTypes],
      excludeEventTypes: [...state.excludeEventTypes],
      includeParticipants: [...state.includeParticipants],
      excludeParticipants: [...state.excludeParticipants],
    }));
  } catch {
    // ignore quota / serialization errors
  }
}

export const EventFilterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    isAnyFilterActive: computed(() =>
      store.includeSports().size > 0 ||
      store.excludeSports().size > 0 ||
      store.includeCompetitions().size > 0 ||
      store.excludeCompetitions().size > 0 ||
      store.includeEventTypes().size > 0 ||
      store.excludeEventTypes().size > 0 ||
      store.includeParticipants().size > 0 ||
      store.excludeParticipants().size > 0
    ),
    activeFilters: computed(() => ({
      includeSports: store.includeSports(),
      excludeSports: store.excludeSports(),
      includeCompetitions: store.includeCompetitions(),
      excludeCompetitions: store.excludeCompetitions(),
      includeEventTypes: store.includeEventTypes(),
      excludeEventTypes: store.excludeEventTypes(),
      includeParticipants: store.includeParticipants(),
      excludeParticipants: store.excludeParticipants(),
    })),
  })),

  withMethods((store) => ({
    applyFilters(events: SportEvent[]): SportEvent[] {
      const snapshot: EventFilterState = {
        includeSports: store.includeSports(),
        excludeSports: store.excludeSports(),
        includeCompetitions: store.includeCompetitions(),
        excludeCompetitions: store.excludeCompetitions(),
        includeEventTypes: store.includeEventTypes(),
        excludeEventTypes: store.excludeEventTypes(),
        includeParticipants: store.includeParticipants(),
        excludeParticipants: store.excludeParticipants(),
      };
      return events.filter(ev => eventPasses(ev, snapshot));
    },
    showOnlySport(key: string): void {
      patchState(store, {
        includeSports: withAdded(store.includeSports(), key),
        excludeSports: withRemoved(store.excludeSports(), key),
      });
    },
    hideSport(key: string): void {
      patchState(store, {
        excludeSports: withAdded(store.excludeSports(), key),
        includeSports: withRemoved(store.includeSports(), key),
      });
    },
    clearSport(key: string): void {
      patchState(store, {
        includeSports: withRemoved(store.includeSports(), key),
        excludeSports: withRemoved(store.excludeSports(), key),
      });
    },
    showOnlyCompetition(key: string): void {
      patchState(store, {
        includeCompetitions: withAdded(store.includeCompetitions(), key),
        excludeCompetitions: withRemoved(store.excludeCompetitions(), key),
      });
    },
    hideCompetition(key: string): void {
      patchState(store, {
        excludeCompetitions: withAdded(store.excludeCompetitions(), key),
        includeCompetitions: withRemoved(store.includeCompetitions(), key),
      });
    },
    clearCompetition(key: string): void {
      patchState(store, {
        includeCompetitions: withRemoved(store.includeCompetitions(), key),
        excludeCompetitions: withRemoved(store.excludeCompetitions(), key),
      });
    },
    showOnlyEventType(key: string): void {
      patchState(store, {
        includeEventTypes: withAdded(store.includeEventTypes(), key),
        excludeEventTypes: withRemoved(store.excludeEventTypes(), key),
      });
    },
    hideEventType(key: string): void {
      patchState(store, {
        excludeEventTypes: withAdded(store.excludeEventTypes(), key),
        includeEventTypes: withRemoved(store.includeEventTypes(), key),
      });
    },
    clearEventType(key: string): void {
      patchState(store, {
        includeEventTypes: withRemoved(store.includeEventTypes(), key),
        excludeEventTypes: withRemoved(store.excludeEventTypes(), key),
      });
    },
    showOnlyParticipant(sportKey: string, competitionName: string, id: number): void {
      const key = participantKey(sportKey, competitionName, id);
      patchState(store, {
        includeParticipants: withAdded(store.includeParticipants(), key),
        excludeParticipants: withRemoved(store.excludeParticipants(), key),
      });
    },
    hideParticipant(sportKey: string, competitionName: string, id: number): void {
      const key = participantKey(sportKey, competitionName, id);
      patchState(store, {
        excludeParticipants: withAdded(store.excludeParticipants(), key),
        includeParticipants: withRemoved(store.includeParticipants(), key),
      });
    },
    clearParticipant(sportKey: string, competitionName: string, id: number): void {
      const key = participantKey(sportKey, competitionName, id);
      patchState(store, {
        includeParticipants: withRemoved(store.includeParticipants(), key),
        excludeParticipants: withRemoved(store.excludeParticipants(), key),
      });
    },
    clearAll(): void {
      patchState(store, initialState);
    },
  })),

  withHooks({
    onInit(store) {
      const stored = loadFromStorage();
      if (Object.keys(stored).length > 0) {
        patchState(store, stored);
      }
      effect(() => {
        const snapshot: EventFilterState = {
          includeSports: store.includeSports(),
          excludeSports: store.excludeSports(),
          includeCompetitions: store.includeCompetitions(),
          excludeCompetitions: store.excludeCompetitions(),
          includeEventTypes: store.includeEventTypes(),
          excludeEventTypes: store.excludeEventTypes(),
          includeParticipants: store.includeParticipants(),
          excludeParticipants: store.excludeParticipants(),
        };
        saveToStorage(snapshot);
      });
    },
  }),
);
