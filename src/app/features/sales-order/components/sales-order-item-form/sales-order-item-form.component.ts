import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { tap } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButton } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ToastService } from '~shared/services/toast.service';

import { Product } from '~features/product/product.interface';
import { ProductService } from '~features/product/product.service';
import { SalesOrderItem } from '~features/sales-order/sales-order-item.interface';
import { SalesOrderItemService } from '~features/sales-order/sales-order-item.service';

@Component({
  selector: 'app-sales-order-item-form',
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButton,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './sales-order-item-form.component.html',
  styleUrl: './sales-order-item-form.component.scss',
})
export class SalesOrderItemFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SalesOrderItemFormComponent>);
  private formBuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private itemService = inject(SalesOrderItemService);
  private toastService = inject(ToastService);

  data = inject(MAT_DIALOG_DATA);
  itemForm!: FormGroup;
  products: Product[] = [];

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      productFk: new FormControl('', [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      unitPrice: new FormControl('', [Validators.required, Validators.min(0)]),
      discount: new FormControl(0, [Validators.min(0)]),
    });

    this.productService
      .getListOfProducts([], [{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        this.products = (data || []).filter((p) => p.isActive !== false);
      });

    // When product is selected, auto-fill unitPrice
    this.itemForm.controls['productFk'].valueChanges.subscribe((productFk) => {
      const product = this.products.find((p) => p.pk === productFk);
      if (product && this.data.action === 'add') {
        this.itemForm.controls['unitPrice'].setValue(product.price);
      }
    });

    if (this.data && this.data.action === 'edit' && this.data.item) {
      this.setFormData(this.data.item);
    }
  }

  setFormData(item: SalesOrderItem) {
    this.itemForm.controls['productFk'].setValue(item.productFk);
    this.itemForm.controls['quantity'].setValue(item.quantity);
    this.itemForm.controls['unitPrice'].setValue(item.unitPrice);
    this.itemForm.controls['discount'].setValue(item.discount || 0);
  }

  onSubmit() {
    const itemData: SalesOrderItem = {
      productFk: this.itemForm.controls['productFk'].value,
      quantity: this.itemForm.controls['quantity'].value,
      unitPrice: this.itemForm.controls['unitPrice'].value,
      discount: this.itemForm.controls['discount'].value || 0,
    };

    if (this.data.action === 'add') {
      this.itemService
        .addOrderItem(this.data.orderId, itemData)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage('Add order item!');
              this.dialogRef.close(true);
            } else {
              this.toastService.showErrorMessage('Add order item!');
            }
          })
        )
        .subscribe();
    } else {
      this.itemService
        .updateOrderItem(this.data.orderId, this.data.item.pk, itemData)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage('Update order item!');
              this.dialogRef.close(true);
            } else {
              this.toastService.showErrorMessage('Update order item!');
            }
          })
        )
        .subscribe();
    }
  }
}
