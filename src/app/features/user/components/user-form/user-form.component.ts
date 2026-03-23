import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TranslateModule } from '@ngx-translate/core';

import { tap } from 'rxjs/operators';

import { ToastService } from '~shared/services/toast.service';
import { UserValidator } from '~core/validators/user.validator';

import { USER_ID } from '~features/user/user.constant';
import { UserService } from '~features/user/user.service';
import { User } from '~features/user/user.interface';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<UserFormComponent>);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private userService = inject(UserService);
  USER_ID = USER_ID;
  data = inject(MAT_DIALOG_DATA);
  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        UserValidator.mustMatch('password'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      isAdmin: new FormControl(false),
      isStaff: new FormControl(false),
      isActive: new FormControl(false),
    });
    if (this.data && this.data.action === 'edit') {
      this.getUserById();
    }
  }

  getUserById() {
    this.userService
      .getUser(this.data.userId, [], [{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        this.setFormData(data);
      });
  }

  setFormData(data: User) {
    this.userForm.controls['name'].setValue(data['name'] || '');
    this.userForm.controls['username'].setValue(data['username'] || '');
    this.userForm.controls['password'].setValue(data['password'] || '');
    this.userForm.controls['confirmPassword'].setValue(data['password'] || '');
    this.userForm.controls['email'].setValue(data['email'] || '');
    this.userForm.controls['phone'].setValue(data['phone'] || '');
    this.userForm.controls['isAdmin'].setValue(data['isAdmin'] || false);
    this.userForm.controls['isStaff'].setValue(data['isStaff'] || false);
    this.userForm.controls['isActive'].setValue(data['isActive'] || false);
  }

  onSubmit() {
    const userInfo: User = {
      name: this.userForm.controls['name'].value,
      username: this.userForm.controls['username'].value,
      password: this.userForm.controls['password'].value,
      email: this.userForm.controls['email'].value,
      phone: this.userForm.controls['phone'].value,
      isAdmin: this.userForm.controls['isAdmin'].value,
      isStaff: this.userForm.controls['isStaff'].value,
      isActive: this.userForm.controls['isActive'].value,
    };
    if (this.data.action === 'add') {
      this.userService
        .createUser(userInfo)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage(
                'Add new User!',
                this.USER_ID.TOAST_ADD_SUCCESS
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Add new User!',
                this.USER_ID.TOAST_ADD_FAILED
              );
            }
          })
        )
        .subscribe();
    } else {
      this.userService
        .updateUser(this.data.userId, userInfo)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage(
                'Update the User!',
                this.USER_ID.TOAST_UPDATE_SUCCESS
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Update new User!',
                this.USER_ID.TOAST_UPDATE_FAILED
              );
            }
          })
        )
        .subscribe();
    }
  }
}
