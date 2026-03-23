import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import {
  EndpointService,
  headerObj,
} from '~shared/services/endpoint.service';

import type { DailySalesReport } from './report.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly endpointService = inject(EndpointService);
  private readonly httpClient = inject(HttpClient);
  private stop$: Subject<void> = new Subject<void>();

  listReports(
    from: string,
    to: string,
    headerOptions?: headerObj[]
  ): Observable<DailySalesReport[]> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.report.dailySales,
        [
          { paramName: 'from', paramVal: from },
          { paramName: 'to', paramVal: to },
        ],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  downloadReport(date: string): Observable<Blob> {
    const params = new HttpParams().set('date', date);
    return this.httpClient.get(ENDPOINTS.report.dailySalesDownload, {
      params,
      responseType: 'blob',
    });
  }
}
