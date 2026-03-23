import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import {
  EndpointService,
  headerObj,
  paramObj,
} from '~shared/services/endpoint.service';

import type { SalesOrderItem } from '~features/sales-order/sales-order-item.interface';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderItemService {
  private readonly endpointService = inject(EndpointService);
  private stop$: Subject<void> = new Subject<void>();

  private itemUrl(orderId: string): string {
    return `${ENDPOINTS.salesOrder.salesOrder}/${orderId}/item`;
  }

  listOrderItems(
    orderId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<{ itemsTotal: number; items: SalesOrderItem[] }> {
    return this.endpointService
      .fetchEndpoint(
        this.itemUrl(orderId),
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  addOrderItem(
    orderId: string,
    data: SalesOrderItem,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService.addEndpoint(
      this.itemUrl(orderId),
      paramsArr || [],
      data,
      headerOptions
    );
  }

  updateOrderItem(
    orderId: string,
    itemId: string,
    data: SalesOrderItem,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .updateEndpoint(
        `${this.itemUrl(orderId)}/${itemId}`,
        paramsArr || [],
        data,
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  deleteOrderItem(
    orderId: string,
    itemId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .deleteEndpoint(
        `${this.itemUrl(orderId)}/${itemId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }
}
