import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants/endpoints.constant';
import { NotificationMessage } from './notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private stop$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  getNotifications(
    pageNumber: number = 0,
    pageSize: number = 10
  ): Observable<{ recordList: NotificationMessage[]; totalRecords: number }> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.httpClient
      .get<any>(ENDPOINTS.notification.list, { params })
      .pipe(
        map((res) => ({
          recordList: res?.recordList || [],
          totalRecords: res?.totalRecord || 0,
        })),
        takeUntil(this.stop$)
      );
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
