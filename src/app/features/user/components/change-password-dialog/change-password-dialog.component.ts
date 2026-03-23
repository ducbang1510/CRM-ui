import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslateModule } from '@ngx-translate/core';

import { tap } from 'rxjs/operators';

import { ToastService } from '~shared/services/toast.service';
import { UserValidator } from '~core/validators/user.validator';
import { UserService } from '~features/user/user.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
})
export class ChangePasswordDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private userService = inject(UserService);

  passwordForm!: FormGroup;

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        UserValidator.mustMatch('newPassword'),
      ]),
    });
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) return;

    const oldPassword = this.passwordForm.controls['oldPassword'].value;
    const newPassword = this.passwordForm.controls['newPassword'].value;

    this.userService
      .changeUserPassword(oldPassword, newPassword)
      .pipe(
        tap((res) => {
          if (res?.['status'] === 1) {
            this.toastService.showSuccessMessage('Password changed successfully!');
            this.dialogRef.close(true);
          } else {
            this.toastService.showErrorMessage(
              res?.['msg'] || 'Failed to change password.'
            );
          }
        })
      )
      .subscribe({
        error: () => {
          this.toastService.showErrorMessage(
            'Failed to change password. Please check your old password.'
          );
        },
      });
  }
}
