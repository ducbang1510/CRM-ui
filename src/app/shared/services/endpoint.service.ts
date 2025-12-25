import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EndpointFactoryService } from './endpoint-factory.service';

export type paramObj = {
  paramName: string;
  paramVal: string | number | boolean;
};

export type headerObj = {
  name: string;
  value: string | number | boolean;
};

@Injectable({
  providedIn: 'root',
})
export class EndpointService extends EndpointFactoryService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetchEndpoint(
    endpoint: string,
    paramsArr: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    let params = new HttpParams();
    paramsArr.forEach((param) => {
      if (param.paramName) {
        params = params.append(param.paramName, param.paramVal);
      }
    });
    return this.httpClient
      .get(endpoint, {
        headers: this.getRequestHeaders(headerOptions),
        params: params,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  addEndpoint(
    endpoint: string,
    paramsArr: paramObj[],
    reqBody: {},
    headerOptions?: headerObj[]
  ): Observable<any> {
    let params = new HttpParams();
    paramsArr.forEach((param) => {
      if (param.paramName) {
        params = params.append(param.paramName, param.paramVal);
      }
    });
    return this.httpClient
      .post(endpoint, reqBody, {
        headers: this.getRequestHeaders(headerOptions),
        params: params,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateEndpoint(
    endpoint: string,
    paramsArr: paramObj[],
    reqBody: {},
    headerOptions?: headerObj[]
  ): Observable<any> {
    let params = new HttpParams();
    paramsArr.forEach((param) => {
      if (param.paramName) {
        params = params.append(param.paramName, param.paramVal);
      }
    });
    return this.httpClient
      .put(endpoint, reqBody, {
        headers: this.getRequestHeaders(headerOptions),
        params: params,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteEndpoint(
    endpoint: string,
    paramsArr: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    let params = new HttpParams();
    paramsArr.forEach((param) => {
      if (param.paramName) {
        params = params.append(param.paramName, param.paramVal);
      }
    });
    return this.httpClient
      .delete(endpoint, {
        headers: this.getRequestHeaders(headerOptions),
        params: params,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }
}
