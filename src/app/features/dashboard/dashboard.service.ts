import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import {
  EndpointService,
  headerObj,
} from '~shared/services/endpoint.service';

import type { RevenueTrend, PipelineSummary, TopUser } from './dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly endpointService = inject(EndpointService);
  private stop$: Subject<void> = new Subject<void>();

  getRevenueTrend(
    months: number = 12,
    headerOptions?: headerObj[]
  ): Observable<RevenueTrend[]> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.dashboard.revenueTrend,
        [{ paramName: 'months', paramVal: months }],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  getPipelineSummary(headerOptions?: headerObj[]): Observable<PipelineSummary[]> {
    return this.endpointService
      .fetchEndpoint(ENDPOINTS.dashboard.pipelineSummary, [], headerOptions)
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  getTopUsers(
    limit: number = 5,
    headerOptions?: headerObj[]
  ): Observable<TopUser[]> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.dashboard.topUsers,
        [{ paramName: 'limit', paramVal: limit }],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }
}
