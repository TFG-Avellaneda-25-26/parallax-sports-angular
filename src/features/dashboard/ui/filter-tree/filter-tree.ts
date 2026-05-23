import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import {
  CompetitionNode,
  EventFilterStore,
  EventTypeNode,
  FilterLevel,
  ParticipantNode,
  SportNode,
  competitionKey,
  participantKey,
} from '@features/dashboard/store/event-filter.store';
import { FilterRowAction, FilterTreeRowComponent } from '../filter-tree-row/filter-tree-row';

@Component({
  selector: 'app-filter-tree',
  imports: [FilterTreeRowComponent],
  templateUrl: './filter-tree.html',
  styleUrl: './filter-tree.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterTreeComponent {
  private readonly filterStore = inject(EventFilterStore);

  readonly nodes = input.required<SportNode[]>();
  protected readonly isAnyFilterActive = this.filterStore.isAnyFilterActive;

  // Sports: tracked as a *collapsed* set → empty = all sports open by default.
  private readonly collapsedSports = signal<ReadonlySet<string>>(new Set());
  // Competitions: tracked as an *expanded* set → empty = all competitions
  // closed by default (user sees sport→competition list, not the team drill-down).
  private readonly expandedCompetitions = signal<ReadonlySet<string>>(new Set());

  // All 8 filter-set signals aggregated into one local computed so Angular's
  // zoneless + OnPush reactive CD has a single, clean dependency node to track.
  // Reading cross-component store signals directly in the template can cause
  // the component to miss updates on the first CD pass after route activation.
  protected readonly filterState = computed(() => ({
    includeSports: this.filterStore.includeSports(),
    excludeSports: this.filterStore.excludeSports(),
    includeCompetitions: this.filterStore.includeCompetitions(),
    excludeCompetitions: this.filterStore.excludeCompetitions(),
    includeEventTypes: this.filterStore.includeEventTypes(),
    excludeEventTypes: this.filterStore.excludeEventTypes(),
    includeParticipants: this.filterStore.includeParticipants(),
    excludeParticipants: this.filterStore.excludeParticipants(),
  }));

  protected readonly hasNodes = computed(() => this.nodes().length > 0);

  protected isSportExpanded(key: string): boolean {
    return !this.collapsedSports().has(key);
  }

  protected isCompetitionExpanded(key: string): boolean {
    return this.expandedCompetitions().has(key);
  }

  protected toggleSport(key: string): void {
    this.collapsedSports.update(set => toggle(set, key));
  }

  protected toggleCompetition(key: string): void {
    this.expandedCompetitions.update(set => toggle(set, key));
  }

  protected isSportActive(sport: SportNode): boolean {
  const f = this.filterState();
  if (f.includeSports.has(sport.key)) return true;
  return sport.competitions.some(comp =>
    f.includeCompetitions.has(comp.key) ||
    comp.eventTypes.some(et => f.includeEventTypes.has(et.key)) ||
    comp.participants.some(p =>
      f.includeParticipants.has(participantKey(p.sportKey, p.competitionName, p.id))
    )
  );
}

  protected isCompetitionActive(comp: CompetitionNode): boolean {
  const f = this.filterState();
  if (f.includeCompetitions.has(comp.key)) return true;
  return comp.eventTypes.some(et => f.includeEventTypes.has(et.key)) ||
    comp.participants.some(p =>
      f.includeParticipants.has(participantKey(p.sportKey, p.competitionName, p.id))
    );
}

  protected onSportAction(sport: SportNode, action: FilterRowAction): void {
    if (action === 'clear') {
      this.filterStore.clearSport(sport.key);
      for (const comp of sport.competitions) {
        this.filterStore.clearCompetition(comp.key);
        for (const et of comp.eventTypes) {
          this.filterStore.clearEventType(et.key);
        }
        for (const p of comp.participants) {
          this.filterStore.clearParticipant(p.sportKey, p.competitionName, p.id);
        }
      }
    } else {
      this.dispatch('sport', sport.key, action);
    }
  }

  protected onCompetitionAction(competition: CompetitionNode, sport: SportNode, action: FilterRowAction): void {
    if (action === 'clear') {
      this.filterStore.clearCompetition(competition.key);
      for (const et of competition.eventTypes) {
        this.filterStore.clearEventType(et.key);
      }
      for (const p of competition.participants) {
        this.filterStore.clearParticipant(p.sportKey, p.competitionName, p.id);
      }
    } else {
      this.dispatch('competition', competition.key, action);
    }
  }

  protected onEventTypeAction(eventType: EventTypeNode, competition: CompetitionNode, sport: SportNode, action: FilterRowAction): void {
    if (action === 'clear') {
      this.filterStore.clearEventType(eventType.key);
    } else {
      this.filterStore.showOnlyCompetition(competition.key);
      this.dispatch('eventType', eventType.key, action);
    }
  }

  protected onParticipantAction(participant: ParticipantNode, competition: CompetitionNode, sport: SportNode, action: FilterRowAction): void {
  if (action === 'clear') {
    this.filterStore.clearParticipant(participant.sportKey, participant.competitionName, participant.id);
  } else {
    this.filterStore.showOnlyCompetition(competition.key);
    this.dispatch('participant', {
      id: participant.id,
      sportKey: participant.sportKey,
      competitionName: participant.competitionName
    }, action);
  }
}

  protected clearAll(): void {
    this.filterStore.clearAll();
  }

  protected competitionId(sportKey: string, name: string): string {
    return competitionKey(sportKey, name);
  }

  private dispatch(level: FilterLevel, id: string | { id: number; sportKey: string; competitionName: string }, action: FilterRowAction): void {
    if (level === 'sport') {
      const key = id as string;
      if (action === 'showOnly') this.filterStore.showOnlySport(key);
      else if (action === 'hide') this.filterStore.hideSport(key);
      else this.filterStore.clearSport(key);
    } else if (level === 'competition') {
      const key = id as string;
      if (action === 'showOnly') this.filterStore.showOnlyCompetition(key);
      else if (action === 'hide') this.filterStore.hideCompetition(key);
      else this.filterStore.clearCompetition(key);
    } else if (level === 'eventType') {
      const key = id as string;
      if (action === 'showOnly') this.filterStore.showOnlyEventType(key);
      else if (action === 'hide') this.filterStore.hideEventType(key);
      else this.filterStore.clearEventType(key);
    } else {
      const { id: pid, sportKey, competitionName } = id as { id: number; sportKey: string; competitionName: string };
      if (action === 'showOnly') this.filterStore.showOnlyParticipant(sportKey, competitionName, pid);
      else if (action === 'hide') this.filterStore.hideParticipant(sportKey, competitionName, pid);
      else this.filterStore.clearParticipant(sportKey, competitionName, pid);
    }
  }

  protected participantKey(sportKey: string, competitionName: string, participantId: number): string {
    return participantKey(sportKey, competitionName, participantId);
  }
}

function toggle<T>(set: ReadonlySet<T>, value: T): ReadonlySet<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

