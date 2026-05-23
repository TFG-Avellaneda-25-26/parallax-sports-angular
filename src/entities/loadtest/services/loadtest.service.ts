import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiClient } from '@shared/api';
import { API_BASE_URL } from '@shared/config';
import {
  LoadTestRun,
  LoadTestRunPage,
  LoadTestScenario,
  LoadTestStartRequest,
} from '../model/loadtest.model';

@Injectable({ providedIn: 'root' })
export class LoadTestService {
  private readonly api = inject(ApiClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listScenarios() {
    return this.api.get<LoadTestScenario[]>('/api/admin/loadtest/scenarios');
  }

  listRuns(page = 0, size = 50) {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.api.get<LoadTestRunPage>(`/api/admin/loadtest/runs?${params.toString()}`);
  }

  start(body: LoadTestStartRequest) {
    return this.api.post<LoadTestRun>('/api/admin/loadtest/runs', body);
  }

  stop(runUuid: string) {
    return this.api.post<LoadTestRun>(`/api/admin/loadtest/runs/${runUuid}/stop`, {});
  }

  /**
   * Opens an SSE connection that streams k6 container logs. Pass the returned
   * EventSource so the caller can `.close()` when leaving the page.
   */
  streamLogs(runUuid: string): EventSource {
    const url = `${this.baseUrl}/api/admin/loadtest/runs/${runUuid}/logs`;
    return new EventSource(url, { withCredentials: true });
  }
}
