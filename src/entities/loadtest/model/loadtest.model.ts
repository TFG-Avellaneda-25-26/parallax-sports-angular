export interface LoadTestScenario {
  id: string;
  name: string;
  description: string | null;
  defaultVus: number | null;
  defaultDuration: string | null;
}

export type LoadTestStatus = 'running' | 'stopped' | 'completed' | 'failed';

export interface LoadTestRun {
  runUuid: string;
  scenarioId: string;
  status: LoadTestStatus;
  exitCode: number | null;
  startedByUserId: number | null;
  startedAt: string;
  finishedAt: string | null;
  vus: number | null;
  duration: string | null;
  summaryJson: Record<string, unknown> | null;
}

export interface LoadTestRunPage {
  content: LoadTestRun[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface LoadTestStartRequest {
  scenarioId: string;
  vus?: number | null;
  duration?: string | null;
  envOverrides?: Record<string, string> | null;
}
