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

  private readonly expandedSports = signal<ReadonlySet<string>>(new Set());
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
    return this.expandedSports().has(key);
  }

  protected isCompetitionExpanded(key: string): boolean {
    return this.expandedCompetitions().has(key);
  }

  protected toggleSport(key: string): void {
    this.expandedSports.update(set => toggle(set, key));
  }

  protected toggleCompetition(key: string): void {
    this.expandedCompetitions.update(set => toggle(set, key));
  }

  protected onSportAction(sport: SportNode, action: FilterRowAction): void {
    this.dispatch('sport', sport.key, action);
  }

  protected onCompetitionAction(competition: CompetitionNode, action: FilterRowAction): void {
    this.dispatch('competition', competition.key, action);
  }

  protected onEventTypeAction(eventType: EventTypeNode, action: FilterRowAction): void {
    this.dispatch('eventType', eventType.key, action);
  }

  protected onParticipantAction(participant: ParticipantNode, action: FilterRowAction): void {
    this.dispatch('participant', { id: participant.id, sportKey: participant.sportKey}, action);
  }

  protected clearAll(): void {
    this.filterStore.clearAll();
  }

  protected competitionId(sportKey: string, name: string): string {
    return competitionKey(sportKey, name);
  }

  private dispatch(level: FilterLevel, id: string | { id: number; sportKey: string }, action: FilterRowAction): void {
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
      const { id: pid, sportKey } = id as { id: number; sportKey: string };
      if (action === 'showOnly') this.filterStore.showOnlyParticipant(sportKey, pid);
      else if (action === 'hide') this.filterStore.hideParticipant(sportKey, pid);
      else this.filterStore.clearParticipant(sportKey, pid);
    }
  }

  protected participantKey(sportKey: string, participantId: number): string {
    return participantKey(sportKey, participantId);
  }
}

function toggle<T>(set: ReadonlySet<T>, value: T): ReadonlySet<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

