import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AUTH_ID } from '~features/authentication/auth.constant';
import { AuthService } from '~features/authentication/auth.service';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    TranslateModule,
    MatInputModule,
    MatButton,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  readonly AUTH_ID = AUTH_ID;

  loginWithOAuth2() {
    this.authService.navigateToOAuth2Page();
  }
}
