import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';

import { LOCAL_STORAGE_KEYS } from '~shared/constants';
import { EndpointService } from '~shared/services/endpoint.service';

import { environment } from '~environments/environment';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  refresh_token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly endpointService = inject(EndpointService);
  private user$ = new BehaviorSubject<any | null>(null);
  private readonly AUTH_SERVER = `${environment.apiDomain}`;
  private readonly CLIENT_ID = `${environment.clientId}`;
  private readonly CLIENT_SECRET = `${environment.clientSecret}`;
  private readonly REDIRECT_URI = `${environment.domain}`;
  private readonly authorizeHeaderOptions = [
    { name: 'NoAuth', value: 'True' },
    { name: 'content-Type', value: 'application/x-www-form-urlencoded' },
    {
      name: 'Authorization',
      value: 'Basic ' + btoa(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`),
    },
  ];

  getCurrentUserInfo(paramsArr?: any[]): Observable<any> {
    return this.endpointService
      .fetchEndpoint(ENDPOINTS.user.user, paramsArr || [])
      .pipe(
        map((res) => res['data']),
        tap((res) => this.user$.next(res))
      );
  }

  /* Handling functions for new authentication method */
  navigateToOAuth2Page(): void {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      scope: 'api:read',
    });
    const authorizeURL = `${this.AUTH_SERVER}/oauth2/authorize?${params}`;
    window.location.href = authorizeURL;
  }

  handleGetAccessToken(): Observable<TokenResponse> {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get('code');
    if (authorizationCode) {
      // Clean URL (remove code parameter)
      window.history.replaceState({}, document.title, window.location.pathname);
      return this.getAccessToken(authorizationCode);
    } else {
      throw new Error(`No authorization code found in URL: ${url}`);
    }
  }

  private getAccessToken(authorizationCode: string): Observable<TokenResponse> {
    const requestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: this.REDIRECT_URI,
    });

    return this.endpointService.addEndpoint(
      `${this.AUTH_SERVER}/oauth2/token`,
      [],
      requestBody.toString(),
      this.authorizeHeaderOptions
    );
  }

  logout(): Observable<any> {
    // authInterceptor automatically adds Authorization: Bearer {token}
    return this.endpointService.addEndpoint(
      `${this.AUTH_SERVER}/oauth2/logout`,
      [],
      {}
    );
  }

  getRefreshToken(refreshToken: string): Observable<TokenResponse> {
    const requestBody = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    return this.endpointService.addEndpoint(
      `${this.AUTH_SERVER}/oauth2/token`,
      [],
      requestBody.toString(),
      this.authorizeHeaderOptions
    );
  }

  isAuthenticated(): boolean {
    return !!this.getDataFromLocalStorage(LOCAL_STORAGE_KEYS.OAUTH2_TOKEN);
  }

  /* Functions for handling Local Storage */
  setDataToLocalStorage(key: string, value: any): void {
    const storage = this.resolveStorage(key);
    if (typeof value === 'object') {
      storage.setItem(key, JSON.stringify(value));
    } else {
      storage.setItem(key, value);
    }
  }

  removeDataFromLocalStorage(key: string): void {
    this.resolveStorage(key).removeItem(key);
  }

  tryParseJSONObject(jsonString: string) {
    try {
      const object = JSON.parse(jsonString);
      if (object && typeof object === 'object') {
        return true;
      }
    } catch (error) {}
    return false;
  }

  getDataFromLocalStorage(key: string) {
    const data = this.resolveStorage(key).getItem(key);
    if (!data) {
      return null;
    }
    return this.tryParseJSONObject(data) ? JSON.parse(data) : data;
  }

  /**
   * OAuth2 token is kept in sessionStorage so it is cleared automatically
   * when the browser tab or window is closed. All other keys use localStorage.
   */
  private resolveStorage(key: string): Storage {
    return key === LOCAL_STORAGE_KEYS.OAUTH2_TOKEN
      ? window.sessionStorage
      : window.localStorage;
  }
}
