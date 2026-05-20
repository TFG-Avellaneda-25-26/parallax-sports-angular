import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  CompetitionNode,
  EventFilterStore,
  EventTypeNode,
  FilterLevel,
  ParticipantNode,
  SportNode,
  competitionKey,
} from '../../store/event-filter.store';
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

  protected readonly nodes = this.filterStore.treeNodes;
  protected readonly isAnyFilterActive = this.filterStore.isAnyFilterActive;

  private readonly expandedSports = signal<ReadonlySet<string>>(new Set());
  private readonly expandedCompetitions = signal<ReadonlySet<string>>(new Set());

  protected readonly includeSports = this.filterStore.includeSports;
  protected readonly excludeSports = this.filterStore.excludeSports;
  protected readonly includeCompetitions = this.filterStore.includeCompetitions;
  protected readonly excludeCompetitions = this.filterStore.excludeCompetitions;
  protected readonly includeEventTypes = this.filterStore.includeEventTypes;
  protected readonly excludeEventTypes = this.filterStore.excludeEventTypes;
  protected readonly includeParticipants = this.filterStore.includeParticipants;
  protected readonly excludeParticipants = this.filterStore.excludeParticipants;

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
    this.dispatch('participant', participant.id, action);
  }

  protected clearAll(): void {
    this.filterStore.clearAll();
  }

  protected competitionId(sportKey: string, name: string): string {
    return competitionKey(sportKey, name);
  }

  private dispatch(level: FilterLevel, id: string | number, action: FilterRowAction): void {
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
      const pid = id as number;
      if (action === 'showOnly') this.filterStore.showOnlyParticipant(pid);
      else if (action === 'hide') this.filterStore.hideParticipant(pid);
      else this.filterStore.clearParticipant(pid);
    }
  }
}

function toggle<T>(set: ReadonlySet<T>, value: T): ReadonlySet<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}
