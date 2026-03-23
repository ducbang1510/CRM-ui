import { Injectable, inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '~features/authentication/auth.service';
import { LOCAL_STORAGE_KEYS } from '~shared/constants';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (!code) {
      if (!this.authService.isAuthenticated()) {
        this.router.navigateByUrl('/login');
        this.authService.removeDataFromLocalStorage(
          LOCAL_STORAGE_KEYS.OAUTH2_TOKEN
        );
        // clear all value from local storage and session storage
        window.localStorage.clear();
        window.sessionStorage.clear();
        return false;
      }
    }
    return true;
  }
}
