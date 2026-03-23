import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';

import { DialogComponent } from '~shared/components/dialog/dialog.component';
import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';
import { ToastService } from '~shared/services/toast.service';

import { ProductDetailsComponent } from '~features/product/components/product-details/product-details.component';
import { ProductFormComponent } from '~features/product/components/product-form/product-form.component';
import { PRODUCT_ID } from '~features/product/product.constant';
import { Product } from '~features/product/product.interface';
import { ProductService } from '~features/product/product.service';

@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    NoDataFoundComponent,
    TranslateModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  @ViewChild(MatPaginator) productPaginator!: MatPaginator;
  PRODUCT_ID = PRODUCT_ID;
  displayedColumns: string[] = [
    'select',
    'name',
    'price',
    'isActive',
    'createdTime',
    'updatedTime',
    'actions',
  ];
  dataSource = new MatTableDataSource<Product>([]);
  totalRecords: number = 0;
  productIdsChecked: string[] = [];
  searchText: FormControl = new FormControl('');

  constructor(
    protected productService: ProductService,
    public dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.productService.getListOfProducts().subscribe((data) => {
      let products = data || [];
      const searchVal = this.searchText.value?.trim().toLowerCase();
      if (searchVal) {
        products = products.filter((p) =>
          p.name?.toLowerCase().includes(searchVal)
        );
      }
      this.totalRecords = products.length;
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.productPaginator;
    });
  }

  resetData() {
    this.searchText = new FormControl('');
    this.loadData();
  }

  onSearch() {
    this.loadData();
  }

  openFormDialog(action: string, productId?: string) {
    const formDialogRef = this.dialog.open(ProductFormComponent, {
      disableClose: true,
      width: '1200px',
      data: {
        action,
        productId,
      },
    });
    formDialogRef.afterClosed().subscribe((result) => {
      this.loadData();
    });
  }

  openProductDetailsDialog(productId: string) {
    const productDetailsDialogRef = this.dialog.open(ProductDetailsComponent, {
      disableClose: true,
      width: '600px',
      data: {
        productId,
      },
    });
    productDetailsDialogRef.afterClosed().subscribe((result) => {});
  }

  onDelete(productId: string, productName: string) {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
    });
    confirmDialogRef.componentInstance.content = `You want to delete the "${productName}"?`;
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.productService
            .deleteProduct(
              productId,
              [],
              [{ name: 'skipLoading', value: 'true' }]
            )
            .pipe(
              tap((res) => {
                if (res['status'] === 1) {
                  this.toastService.showSuccessMessage(
                    'Delete the Product!',
                    this.PRODUCT_ID.TOAST_DELETE_SUCCESS
                  );
                } else {
                  this.toastService.showErrorMessage(
                    'Delete the Product!',
                    this.PRODUCT_ID.TOAST_DELETE_FAILED
                  );
                }
              })
            )
            .subscribe(() => {
              confirmDialogRef.close();
            });
        }
      }
    );
    confirmDialogRef.afterClosed().subscribe((result) => {
      this.loadData();
    });
  }

  onBulkDeleteProducts() {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
    });
    confirmDialogRef.componentInstance.content = `You want to delete the products?`;
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.productService
            .bulkDeleteProducts(
              this.productIdsChecked,
              [],
              [{ name: 'skipLoading', value: 'true' }]
            )
            .pipe(
              tap((res) => {
                if (res['status'] === 1) {
                  this.toastService.showSuccessMessage(
                    'Delete the Products!',
                    this.PRODUCT_ID.TOAST_DELETE_MULTIPLE_SUCCESS
                  );
                } else {
                  this.toastService.showErrorMessage(
                    'Delete the Products!',
                    this.PRODUCT_ID.TOAST_DELETE_MULTIPLE_FAILED
                  );
                }
              })
            )
            .subscribe(() => {
              confirmDialogRef.close();
            });
        }
      }
    );
    confirmDialogRef.afterClosed().subscribe((result) => {
      this.productIdsChecked = [];
      this.loadData();
    });
  }

  onCheckboxChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const productId = (event.target as HTMLInputElement).value;
    if (isChecked) {
      this.productIdsChecked.push(productId);
    } else {
      this.productIdsChecked.splice(
        this.productIdsChecked.indexOf(productId),
        1
      );
    }
  }
}
