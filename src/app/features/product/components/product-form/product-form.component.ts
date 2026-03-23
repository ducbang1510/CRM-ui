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

import { ToastService } from '~shared/services/toast.service';

import { PRODUCT_ID } from '~features/product/product.constant';
import { Product } from '~features/product/product.interface';
import { ProductService } from '~features/product/product.service';

@Component({
  selector: 'app-product-form',
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
    MatCheckboxModule,
    MatSlideToggleModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ProductFormComponent>);
  private formBuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  PRODUCT_ID = PRODUCT_ID;
  data = inject(MAT_DIALOG_DATA);
  productForm!: FormGroup;
  createdTime = new Date();

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      isActive: new FormControl(true),
      description: new FormControl(''),
    });

    if (this.data && this.data.action === 'edit') {
      this.getProductById();
    }
  }

  getProductById() {
    this.productService
      .getProduct(
        this.data.productId,
        [],
        [{ name: 'skipLoading', value: 'true' }]
      )
      .subscribe((data) => {
        this.setFormData(data);
      });
  }

  setFormData(data: Product) {
    this.productForm.controls['name'].setValue(data['name'] || '');
    this.productForm.controls['price'].setValue(data['price'] || '');
    this.productForm.controls['isActive'].setValue(
      data['isActive'] !== undefined ? data['isActive'] : true
    );
    this.productForm.controls['description'].setValue(
      data['description'] || ''
    );
    this.createdTime = data['createdTime'] || new Date();
  }

  onSubmit() {
    const productInfo: Product = {
      name: this.productForm.controls['name'].value,
      price: this.productForm.controls['price'].value,
      isActive: this.productForm.controls['isActive'].value,
      description: this.productForm.controls['description'].value,
      createdTime:
        this.data && this.data.action === 'add' ? new Date() : this.createdTime,
      updatedTime: new Date(),
    };
    if (this.data.action === 'add') {
      this.productService
        .addProduct(productInfo)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage(
                'Add new Product!',
                this.PRODUCT_ID.TOAST_ADD_SUCCESS
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Add new Product!',
                this.PRODUCT_ID.TOAST_ADD_FAILED
              );
            }
          })
        )
        .subscribe();
    } else {
      this.productService
        .updateProduct(this.data.productId, productInfo)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage(
                'Update the Product!',
                this.PRODUCT_ID.TOAST_UPDATE_SUCCESS
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Update the Product!',
                this.PRODUCT_ID.TOAST_UPDATE_FAILED
              );
            }
          })
        )
        .subscribe();
    }
  }
}
