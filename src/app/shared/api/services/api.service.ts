import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import {
  ApiConfig,
  ApiFailure,
  ApiParams,
  ApiResponse,
  ApiSuccess,
  HttpClientRequestOptionsBase as RequestOptionsBase,
} from '../types';

const REQUEST_OPTIONS_DEFAULT: RequestOptionsBase = {
  observe: 'body',
  responseType: 'json',
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  private fetch<T = any>(
    method: 'delete' | 'get' | 'patch' | 'post' | 'put',
    url: string,
    options?: RequestOptionsBase
  ): Observable<ApiResponse<T>> {
    return this.httpClient
      .request<T>(method, url, {
        ...REQUEST_OPTIONS_DEFAULT,
        ...options,
      } as any)
      .pipe(
        map((response) => new ApiSuccess(response as T)),
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return of(new ApiFailure(error));
        })
      );
  }

  // NOTE: QUERY: USE { KEY: VALUE }
  // UPDATE: REMOVE NULL AND UNDEFINED VALUE IN QUERY

  delete<T = any>(url: string, params?: ApiParams, options?: ApiConfig) {
    return this.fetch<T>('delete', url, {
      ...options,
      params,
    });
  }

  get<T = any>(url: string, params?: ApiParams, options?: ApiConfig) {
    return this.fetch<T>('get', url, {
      ...options,
      params,
    });
  }

  patch<T = any>(
    url: string,
    data?: any,
    params?: ApiParams,
    options?: ApiConfig
  ) {
    return this.fetch<T>('patch', url, {
      ...options,
      body: data,
      params,
    });
  }

  post<T = any>(
    url: string,
    data?: any,
    params?: ApiParams,
    options?: ApiConfig
  ) {
    return this.fetch<T>('post', url, {
      ...options,
      body: data,
      params,
    });
  }

  put<T = any>(
    url: string,
    data?: any,
    params?: ApiParams,
    options?: ApiConfig
  ) {
    return this.fetch<T>('put', url, {
      ...options,
      body: data,
      params,
    });
  }
}
