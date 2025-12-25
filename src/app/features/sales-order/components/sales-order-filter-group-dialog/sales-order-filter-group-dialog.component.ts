import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import type { User } from '~features/user/user.interface';
import { UserService } from '~features/user/user.service';
import { DateRangeValidator } from '~core/validators/common.validator';

@Component({
  selector: 'app-sales-order-filter-group-dialog',
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButton,
    MatDialogModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './sales-order-filter-group-dialog.component.html',
  styleUrl: './sales-order-filter-group-dialog.component.scss',
})
export class SalesOrderFilterGroupDialogComponent implements OnInit {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
  isShowAssignedUserFilter: boolean = true;
  assignedToUsers!: User[];

  createdTimeForm!: FormGroup;
  updatedTimeForm!: FormGroup;

  status: FormControl = new FormControl('');
  assignedTo: FormControl = new FormControl('');

  constructor() {}
  ngOnInit(): void {
    this.loadData();
    this.createdTimeForm = this.formBuilder.group(
      {
        createdTimeFrom: new FormControl(Validators.required),
        createdTimeTo: new FormControl(Validators.required),
      },
      { validators: DateRangeValidator('createdTimeFrom', 'createdTimeTo') }
    );
    this.updatedTimeForm = this.formBuilder.group(
      {
        updatedTimeFrom: new FormControl(Validators.required),
        updatedTimeTo: new FormControl(Validators.required),
      },
      { validators: DateRangeValidator('updatedTimeFrom', 'updatedTimeTo') }
    );
  }

  loadData() {
    this.userService
      .getListOfUsers([], [{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        this.assignedToUsers = data || [];
      });
  }
}
