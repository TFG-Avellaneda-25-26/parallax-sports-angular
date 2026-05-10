import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SportEvent } from '@entities/event';
import { UserStore } from '@entities/user';
import { EventTimePipe } from '@shared/lib';

interface EventGroup {
  id: string;
  parent: SportEvent | null;
  children: SportEvent[];
}

@Component({
  selector: 'app-event-table',
  imports: [EventTimePipe],
  templateUrl: './event-table.html',
  styleUrl: './event-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTableComponent {
  readonly events = input.required<SportEvent[]>();

  private readonly userStore = inject(UserStore);
  protected readonly locale = this.userStore.locale;
  protected readonly timeZone = this.userStore.timeZone;

  protected readonly groups = computed<EventGroup[]>(() => buildGroups(this.events()));
}

function buildGroups(events: SportEvent[]): EventGroup[] {
  const byId = new Map<number, SportEvent>();
  for (const ev of events) byId.set(ev.id, ev);

  const childrenByParent = new Map<number, SportEvent[]>();
  for (const ev of events) {
    if (ev.parentEventId !== null) {
      const list = childrenByParent.get(ev.parentEventId) ?? [];
      list.push(ev);
      childrenByParent.set(ev.parentEventId, list);
    }
  }

  const groups: EventGroup[] = [];
  const seen = new Set<number>();

  for (const ev of events) {
    if (seen.has(ev.id)) continue;

    if (ev.parentEventId !== null && byId.has(ev.parentEventId)) {
      // child whose parent is in the list — handled when we hit the parent
      continue;
    }

    const children = childrenByParent.get(ev.id) ?? [];
    if (children.length > 0) {
      // ev is a parent
      const sortedChildren = [...children].sort(byStart);
      groups.push({ id: `g-${ev.id}`, parent: ev, children: sortedChildren });
      seen.add(ev.id);
      for (const c of sortedChildren) seen.add(c.id);
    } else if (ev.parentEventId !== null) {
      // orphan child (parent not loaded) — render alone
      groups.push({ id: `o-${ev.id}`, parent: null, children: [ev] });
      seen.add(ev.id);
    } else {
      // standalone event (no parent, no children)
      groups.push({ id: `s-${ev.id}`, parent: null, children: [ev] });
      seen.add(ev.id);
    }
  }

  return groups;
}

function byStart(a: SportEvent, b: SportEvent): number {
  return a.startTimeUtc.localeCompare(b.startTimeUtc);
}
