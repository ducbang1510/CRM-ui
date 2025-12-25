import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EndpointFactoryService {
  constructor(protected httpClient: HttpClient) {}

  public getRequestHeaders(options?: any[]) {
    let headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'application/json; charset=utf-8');
    // headers = headers.append('Access-Control-Allow-Origin', '*');
    if (options) {
      options.forEach((option) => {
        headers = headers.append(option.name, option.value);
      });
    }
    return headers;
  }
  
  protected handleError(error: any) {
    return throwError(() => error);
  }
}