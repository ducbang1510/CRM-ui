import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ProgressSpinnerComponent } from '~shared/components/progress-spinner/progress-spinner.component';
import { LOCAL_STORAGE_KEYS } from '~shared/constants';
import { ToastService } from '~shared/services/toast.service';

import { HOME_ID } from '~core/layout/layout.constant';

import { AuthService } from '~features/authentication/auth.service';
import { User } from '~features/user/user.interface';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    TranslateModule,
    MatButton,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    ProgressSpinnerComponent,
  ],
})
export class LayoutComponent implements OnInit {
  HOME_ID = HOME_ID;
  currentUser: User | undefined;

  constructor(
    public translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.setupLanguages();
    if (!this.authService.isAuthenticated()) {
      this.handleAuthenticationEvent();
    }
  }

  ngOnInit(): void {
    const currentUserData = window.localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (currentUserData) {
      this.currentUser = JSON.parse(currentUserData);
    }
  }

  openChangePwdDialog() {}

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  signout() {
    this.authService.removeDataFromLocalStorage(LOCAL_STORAGE_KEYS.OAUTH2_TOKEN);
    window.localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  private handleAuthenticationEvent() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (code) {
      this.authService.handleGetAccessToken().subscribe({
        next: (response) => {
          if (response && Object.keys(response).length) {
            this.authService.setDataToLocalStorage(
              LOCAL_STORAGE_KEYS.OAUTH2_TOKEN,
              response
            );
            this.router.navigateByUrl('/dashboard');
            this.storeCurrentUser();
          } else {
            this.toastService.showErrorMessage(
              'Authentication failed, please try again!'
            );
            this.router.navigateByUrl('/login');
          }
        },
        error: (error) => {
          this.toastService.showErrorMessage(error);
        },
      });
    } else {
      this.toastService.showErrorMessage(
        'Authorization code not found or not authorized. Please try again!'
      );
      this.router.navigateByUrl('/login');
    }
  }

  private storeCurrentUser() {
    this.authService.getCurrentUserInfo().subscribe((data) => {
      this.currentUser = data;
      window.localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(data));
    });
  }

  private setupLanguages() {
    // Set included languages
    this.translate.addLangs(['en', 'vi']);
    const browserLang = navigator.languages
      ? navigator.languages[0].split('-')[0]
      : navigator.language.split('-')[0];

    // Get the current browser language, if included set it
    const defaultLang = this.translate.getLangs().includes(browserLang)
      ? browserLang
      : 'en';

    // Set the default and current language
    this.translate.setDefaultLang(defaultLang);
  }
}
