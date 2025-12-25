import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { tap } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TranslateModule } from '@ngx-translate/core';

import { ToastService } from '~shared/services/toast.service';

import { Contact } from '~features/contact/contact.interface';
import { ContactService } from '~features/contact/contact.service';
import { SALES_ORDER_ID } from '~features/sales-order/sales-order.constant';
import { SalesOrder } from '~features/sales-order/sales-order.interface';
import { SalesOrderService } from '~features/sales-order/sales-order.service';
import { User } from '~features/user/user.interface';
import { UserService } from '~features/user/user.service';

@Component({
  selector: 'app-sales-order-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    TranslateModule,
  ],
  templateUrl: './sales-order-form.component.html',
  styleUrl: './sales-order-form.component.scss',
})
export class SalesOrderFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SalesOrderFormComponent>);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private contactService = inject(ContactService);
  private userService = inject(UserService);
  private salesOrderService = inject(SalesOrderService);

  SALES_ORDER_ID = SALES_ORDER_ID;
  statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
  data = inject(MAT_DIALOG_DATA);
  salesOrderForm!: FormGroup;
  contacts: Contact[] = [];
  assignedToUsers: User[] = [];
  // retain created time when editing Sales order
  createdTime = new Date();

  ngOnInit(): void {
    this.salesOrderForm = this.formBuilder.group({
      contactName: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      total: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      assignedTo: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });

    this.contactService
      .getListOfContactNames([], [{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        this.contacts = data || [];
      });

    this.userService
      .getListOfUserNames([], [{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        this.assignedToUsers = data || [];
      });

    if (this.data && this.data.action === 'edit') {
      this.getSalesOrderById();
    }
  }

  getSalesOrderById() {
    this.salesOrderService
      .getSalesOrder(
        this.data.orderId,
        [],
        [{ name: 'skipLoading', value: 'true' }]
      )
      .subscribe((data) => {
        this.setFormData(data);
      });
  }

  setFormData(data: SalesOrder) {
    this.salesOrderForm.controls['contactName'].setValue(
      data['contactName'] || ''
    );
    this.salesOrderForm.controls['subject'].setValue(data['subject'] || '');
    this.salesOrderForm.controls['status'].setValue(data['status'] || '');
    this.salesOrderForm.controls['total'].setValue(data['total'] || '');
    this.salesOrderForm.controls['assignedTo'].setValue(
      data['assignedTo'] || ''
    );
    this.salesOrderForm.controls['description'].setValue(
      data['description'] || ''
    );
    this.createdTime = data['createdTime'] || new Date();
  }

  onSubmit() {
    const salesOrderInfo: SalesOrder = {
      contactName: this.salesOrderForm.controls['contactName'].value,
      subject: this.salesOrderForm.controls['subject'].value,
      status: this.salesOrderForm.controls['status'].value,
      total: this.salesOrderForm.controls['total'].value,
      assignedTo: this.salesOrderForm.controls['assignedTo'].value,
      description: this.salesOrderForm.controls['description'].value,
      createdTime:
        this.data && this.data.action === 'add' ? new Date() : this.createdTime,
      updatedTime: new Date(),
    };
    if (this.data.action === 'add') {
      this.salesOrderService
        .addSalesOrder(salesOrderInfo)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage(
                'Add new Sales order!',
                this.SALES_ORDER_ID.TOAST_ADD_SUCCESS
              );
              this.dialogRef.close();
            }
          })
        )
        .subscribe();
    } else {
      this.salesOrderService
        .updateSalesOrder(this.data.orderId, salesOrderInfo)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage(
                'Update the Sales order!',
                this.SALES_ORDER_ID.TOAST_UPDATE_SUCCESS
              );
              this.dialogRef.close();
            }
          })
        )
        .subscribe();
    }
  }
}
