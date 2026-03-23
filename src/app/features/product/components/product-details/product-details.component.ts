import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

import { TranslateModule } from '@ngx-translate/core';

import { PRODUCT_ID } from '~features/product/product.constant';
import { Product } from '~features/product/product.interface';
import { ProductService } from '~features/product/product.service';

@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ProductDetailsComponent>);
  private productService = inject(ProductService);

  PRODUCT_ID = PRODUCT_ID;
  product!: Product;
  data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (this.data && this.data.productId) {
      this.productService
        .getProduct(
          this.data.productId,
          [],
          [{ name: 'skipLoading', value: 'true' }]
        )
        .subscribe((data) => {
          this.product = data;
        });
    }
  }
}
