import {
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import type { Observable } from 'rxjs';

import { AuthService } from '~features/authentication/auth.service';

import { LOCAL_STORAGE_KEYS } from '~shared/constants';
import { LoadingService } from '~shared/services/loading.service';

export function authenticationInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);
  const router = inject(Router);

  if (!request.headers.get('skipLoading')) {
    loadingService.showLoading();
  }

  if (request.headers.get('NoAuth')) {
    return next(request.clone());
  } else {
    const authorizationData = authService.getDataFromLocalStorage(
      LOCAL_STORAGE_KEYS.OAUTH2_TOKEN
    );
    if (authorizationData) {
      const requestWithHeader = request.clone({
        headers: request.headers.set(
          'Authorization',
          `Bearer ${authorizationData.access_token}`
        ),
      });
      return next(requestWithHeader).pipe(
        tap({
          next: (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // do something
            }
          },
          error: (err) => {
            if (err.error.auth == false) {
              router.navigateByUrl('/login');
            }
          },
        }),
        finalize(() => {
          if (!request.headers.get('skipLoading')) {
            loadingService.hideLoading();
          }
        })
      );
    }
    return next(request);
  }
}
