import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import {
  EndpointService,
  headerObj,
  paramObj,
} from '~shared/services/endpoint.service';

import type { Product } from '~features/product/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly endpointService = inject(EndpointService);
  private stop$: Subject<void> = new Subject<void>();

  addProduct(
    data: Product,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService.addEndpoint(
      ENDPOINTS.product.product,
      paramsArr || [],
      data,
      headerOptions
    );
  }

  getListOfProducts(
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<Product[]> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.product.productList,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$),
        shareReplay()
      );
  }

  getProduct(
    productId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<Product> {
    return this.endpointService
      .fetchEndpoint(
        `${ENDPOINTS.product.product}/${productId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  updateProduct(
    productId: string,
    productInfo: Product,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .updateEndpoint(
        `${ENDPOINTS.product.product}/${productId}`,
        paramsArr || [],
        productInfo,
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  deleteProduct(
    productId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .deleteEndpoint(
        `${ENDPOINTS.product.product}/${productId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  bulkDeleteProducts(
    productIds: string[],
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .addEndpoint(
        ENDPOINTS.product.bulkDeleteProducts,
        paramsArr || [],
        productIds,
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }
}
