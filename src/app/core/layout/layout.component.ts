import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { MatButton } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Subscription } from 'rxjs';

import { ProgressSpinnerComponent } from '~shared/components/progress-spinner/progress-spinner.component';
import { LOCAL_STORAGE_KEYS } from '~shared/constants';
import { ToastService } from '~shared/services/toast.service';
import { SocketService } from '~shared/services/socket.service';

import { HOME_ID } from '~core/layout/layout.constant';

import { AuthService } from '~features/authentication/auth.service';
import { AiChatWidgetComponent } from '~features/ai-chat/ai-chat-widget/ai-chat-widget.component';
import { ChangePasswordDialogComponent } from '~features/user/components/change-password-dialog/change-password-dialog.component';
import { NotificationPanelComponent } from '~features/notification/notification-panel/notification-panel.component';
import { User } from '~features/user/user.interface';

import { environment } from '~environments/environment';
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
    MatBadgeModule,
    MatButton,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    ProgressSpinnerComponent,
    AiChatWidgetComponent,
    NotificationPanelComponent,
  ],
})
export class LayoutComponent implements OnInit, OnDestroy {
  HOME_ID = HOME_ID;
  currentUser: User | undefined;
  unreadCount = 0;
  private socketSub: Subscription | undefined;

  constructor(
    public translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private socketService: SocketService,
    private dialog: MatDialog
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
    this.initNotifications();
  }

  ngOnDestroy(): void {
    this.socketSub?.unsubscribe();
    this.socketService.disconnect();
  }

  private initNotifications(): void {
    // Connect to Socket.IO for real-time unread count only
    this.socketService.connect();
    this.socketSub = this.socketService.unreadCountChanges$.subscribe(
      (count) => {
        this.unreadCount = count || 0;
      }
    );
  }

  onNotificationPanelOpened(): void {
    // Reset badge — notifications will be marked as read by the panel's API call
    this.unreadCount = 0;
  }

  openChangePwdDialog() {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px',
      disableClose: true,
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  signout() {
    const doLogoutRedirect = () => {
      window.localStorage.clear();
      window.sessionStorage.clear();
      // Redirect browser to BE /logout to invalidate Spring Security session,
      // then logout-success.html redirects back to Angular /login
      window.location.href = `${environment.apiDomain}/logout`;
    };

    if (this.authService.isAuthenticated()) {
      this.authService.logout().subscribe({
        complete: doLogoutRedirect,
        error: doLogoutRedirect,
      });
    } else {
      doLogoutRedirect();
    }
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
