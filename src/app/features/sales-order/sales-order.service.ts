import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil, tap } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import {
  EndpointService,
  headerObj,
  paramObj,
} from '~shared/services/endpoint.service';

import { SalesOrder } from '~features/sales-order/sales-order.interface';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private readonly endpointService = inject(EndpointService);
  private stop$: Subject<void> = new Subject<void>();

  addSalesOrder(
    data: SalesOrder,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService.addEndpoint(
      ENDPOINTS.salesOrder.salesOrder,
      paramsArr || [],
      data,
      headerOptions
    );
  }

  getListOfSalesOrders(
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<SalesOrder[]> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.salesOrder.salesOrderList,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$),
        shareReplay()
      );
  }

  getSalesOrder(
    orderId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<SalesOrder> {
    return this.endpointService
      .fetchEndpoint(
        `${ENDPOINTS.salesOrder.salesOrder}/${orderId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  updateSalesOrder(
    orderId: string,
    orderInfo: SalesOrder,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .updateEndpoint(
        `${ENDPOINTS.salesOrder.salesOrder}/${orderId}`,
        paramsArr || [],
        orderInfo,
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  deleteSalesOrder(
    orderId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .deleteEndpoint(
        `${ENDPOINTS.salesOrder.salesOrder}/${orderId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  bulkDeleteSalesOrder(
    orderIds: string[],
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .addEndpoint(
        ENDPOINTS.salesOrder.bulkDeleteSalesOrders,
        paramsArr || [],
        orderIds,
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  searchSalesOrders(
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.salesOrder.searchSalesOrder,
        paramsArr || [],
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  countSalesOrder(
    countBy: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .fetchEndpoint(
        `${ENDPOINTS.salesOrder.countSalesOrder}/${countBy}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }
}
