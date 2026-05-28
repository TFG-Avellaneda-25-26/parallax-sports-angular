import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
  LoadTestRun,
  LoadTestRunPage,
  LoadTestScenario,
  LoadTestService,
  LoadTestStartRequest,
} from '@entities/loadtest';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ansiToHtml, gsap } from '@shared/lib';

const TYPEWRITER_DURATION = 0.15;

@Component({
  selector: 'app-admin-stress-testing',
  imports: [],
  templateUrl: './stress-testing.component.html',
  styleUrl: './stress-testing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StressTestingComponent {
  private readonly service = inject(LoadTestService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly scenarios = signal<LoadTestScenario[]>([]);
  protected readonly selectedScenarioId = signal<string>('');
  protected readonly vusOverride = signal<string>('');
  protected readonly durationOverride = signal<string>('');

  protected readonly runs = signal<LoadTestRunPage | null>(null);
  protected readonly historyPage = signal(0);

  protected readonly logLines = signal<string[]>([]);
  protected readonly activeRun = signal<LoadTestRun | null>(null);
  protected readonly streaming = signal(false);
  protected readonly busy = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly selectedScenario = computed(() =>
    this.scenarios().find(s => s.id === this.selectedScenarioId()) ?? null
  );

  // ansiToHtml emits only escaped text inside <span class="ansi-*"> wrappers
  // we generate ourselves, so bypassing the sanitizer here is safe and avoids
  // it stripping the class attributes we rely on for theming.
  protected readonly logLinesHtml = computed<SafeHtml[]>(() =>
    this.logLines().map(l => this.sanitizer.bypassSecurityTrustHtml(ansiToHtml(l))),
  );

  // Whether the run is active enough to consider the analog switch "on".
  // A click while busy is ignored at the handler level so the toggle can't
  // race with an in-flight start/stop.
  protected readonly running = computed(() => this.streaming() || this.activeRun()?.status === 'running');

  protected readonly historyRows = computed<LoadTestRun[]>(() => this.runs()?.content ?? []);
  protected readonly historyTotalPages = computed(() => this.runs()?.totalPages ?? 0);
  protected readonly historyIsFirst = computed(() => this.runs()?.first ?? true);
  protected readonly historyIsLast = computed(() => this.runs()?.last ?? true);

  private readonly consoleEl = viewChild<ElementRef<HTMLPreElement>>('consoleEl');
  private readonly lineEls = viewChildren<ElementRef<HTMLSpanElement>>('lineEl');
  private eventSource: EventSource | null = null;
  private previousLineCount = 0;
  private typewriterTween: gsap.core.Tween | null = null;

  constructor() {
    void this.bootstrap();
    this.destroyRef.onDestroy(() => {
      this.closeStream();
      this.typewriterTween?.kill();
    });
    effect(() => {
      const lines = this.logLines();
      const prev = this.previousLineCount;
      const isSingleArrival = lines.length - prev === 1;
      this.previousLineCount = lines.length;

      setTimeout(() => {
        const el = this.consoleEl()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
        if (isSingleArrival) this.animateLastLine();
      }, 0);
    });
  }

  // Type out the most recent line. A burst of lines arriving in one tick
  // collapses to a single effect run with delta > 1, so this only fires when
  // exactly one new line landed — keeps the console readable during fast
  // streams instead of queueing tweens behind each line.
  private animateLastLine(): void {
    const els = this.lineEls();
    const lastRef = els[els.length - 1];
    if (!lastRef) return;

    const el = lastRef.nativeElement;
    const styledHtml = el.innerHTML;
    const rawText = el.textContent ?? '';
    if (!rawText) return;

    this.typewriterTween?.kill();
    el.textContent = '';
    this.typewriterTween = gsap.to(el, {
      duration: TYPEWRITER_DURATION,
      // `text: string` is the type-out form (no scramble). When done we swap
      // the styled HTML back in so ANSI colors return.
      text: rawText,
      ease: 'none',
      onComplete: () => {
        el.innerHTML = styledHtml;
      },
    });
  }

  protected onScenarioChange(id: string): void {
    this.selectedScenarioId.set(id);
  }

  protected onSwitchToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (this.busy()) {
      // Reset the checkbox to match running state so the UI doesn't drift
      // from the actual run.
      (event.target as HTMLInputElement).checked = this.running();
      return;
    }
    if (checked) {
      void this.start();
    } else {
      void this.stop();
    }
  }

  protected async start(): Promise<void> {
    const scenarioId = this.selectedScenarioId();
    if (!scenarioId) {
      this.errorMessage.set('Pick a scenario first.');
      return;
    }
    const body: LoadTestStartRequest = {
      scenarioId,
      vus: this.vusOverride() ? Number(this.vusOverride()) : null,
      duration: this.durationOverride() || null,
    };

    this.busy.set(true);
    this.errorMessage.set(null);
    this.logLines.set([]);
    try {
      const run = await lastValueFrom(this.service.start(body));
      this.activeRun.set(run);
      this.openStream(run.runUuid);
      await this.refreshHistory();
    } catch {
      this.errorMessage.set('Failed to start run.');
    } finally {
      this.busy.set(false);
    }
  }

  protected async stop(): Promise<void> {
    const run = this.activeRun();
    if (!run) return;
    this.busy.set(true);
    this.errorMessage.set(null);
    try {
      const updated = await lastValueFrom(this.service.stop(run.runUuid));
      this.activeRun.set(updated);
      await this.refreshHistory();
    } catch {
      this.errorMessage.set('Failed to stop run.');
    } finally {
      this.busy.set(false);
    }
  }

  protected closeStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.streaming.set(false);
  }

  protected async prevHistoryPage(): Promise<void> {
    if (this.historyIsFirst()) return;
    this.historyPage.update(p => Math.max(0, p - 1));
    await this.refreshHistory();
  }

  protected async nextHistoryPage(): Promise<void> {
    if (this.historyIsLast()) return;
    this.historyPage.update(p => p + 1);
    await this.refreshHistory();
  }

  protected formatSummary(summary: Record<string, unknown> | null): string {
    if (!summary) return '';
    try {
      return JSON.stringify(summary, null, 2);
    } catch {
      return String(summary);
    }
  }

  private async bootstrap(): Promise<void> {
    try {
      const list = await lastValueFrom(this.service.listScenarios());
      this.scenarios.set(list);
      if (list.length > 0) this.selectedScenarioId.set(list[0].id);
    } catch {
      this.errorMessage.set('Failed to load scenarios.');
    }
    await this.refreshHistory();
  }

  private async refreshHistory(): Promise<void> {
    try {
      this.runs.set(await lastValueFrom(this.service.listRuns(this.historyPage(), 25)));
    } catch {
      this.errorMessage.set('Failed to load run history.');
    }
  }

  private openStream(runUuid: string): void {
    this.closeStream();
    const es = this.service.streamLogs(runUuid);
    es.onmessage = (ev) => {
      this.logLines.update(lines => [...lines, ev.data].slice(-1000));
    };
    es.onerror = () => {
      this.streaming.set(false);
      es.close();
    };
    this.eventSource = es;
    this.streaming.set(true);
  }
}
