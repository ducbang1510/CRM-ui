import {
  HttpContext,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';

export abstract class BaseApiResponse<V = any, E = any> {
  abstract isFailed(): boolean;
  abstract isSuccess(): boolean;
}

export class ApiSuccess<V = any, E = HttpErrorResponse> extends BaseApiResponse<
  V,
  E
> {
  constructor(public value: V) {
    super();
  }

  public isFailed(): this is ApiFailure<E, V> {
    return false;
  }

  public isSuccess(): this is ApiSuccess<V, E> {
    return true;
  }
}

export class ApiFailure<E = HttpErrorResponse, V = any> extends BaseApiResponse<
  V,
  E
> {
  constructor(public error: E) {
    super();
  }

  public isFailed(): this is ApiFailure<E, V> {
    return true;
  }

  public isSuccess(): this is ApiSuccess<V, E> {
    return false;
  }
}

export type ApiConfig = Omit<HttpClientRequestOptionsBase, 'body' | 'params'>;

export type ApiParams = Record<string, string | number | boolean>;

export type ApiResponse<V = any, E = HttpErrorResponse> =
  | ApiFailure<E, V>
  | ApiSuccess<V, E>;

export type HttpClientRequestOptionsBase = {
  body?: any;
  context?: HttpContext;
  headers?: HttpHeaders | Record<string, string | string[]>;
  observe?: 'body' | 'events' | 'response';
  params?: HttpParams | Record<string, string | number | boolean>;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
};
