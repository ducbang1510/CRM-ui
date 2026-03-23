import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { tap } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from '@ngx-translate/core';

import { DialogComponent } from '~shared/components/dialog/dialog.component';
import { ToastService } from '~shared/services/toast.service';

import { FileListComponent } from '~shared/components/file-attachments/file-list/file-list.component';
import { NotesListComponent } from '~shared/components/notes/notes-list/notes-list.component';
import { SALES_ORDER_ID } from '~features/sales-order/sales-order.constant';
import { SalesOrder } from '~features/sales-order/sales-order.interface';
import { SalesOrderService } from '~features/sales-order/sales-order.service';
import { SalesOrderItem } from '~features/sales-order/sales-order-item.interface';
import { SalesOrderItemService } from '~features/sales-order/sales-order-item.service';
import { SalesOrderItemFormComponent } from '~features/sales-order/components/sales-order-item-form/sales-order-item-form.component';

@Component({
  selector: 'app-sales-order-details',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    FileListComponent,
    NotesListComponent,
    TranslateModule,
  ],
  templateUrl: './sales-order-details.component.html',
  styleUrl: './sales-order-details.component.scss',
})
export class SalesOrderDetailsComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SalesOrderDetailsComponent>);
  private salesOrderService = inject(SalesOrderService);
  private itemService = inject(SalesOrderItemService);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);

  SALES_ORDER_ID = SALES_ORDER_ID;
  data = inject(MAT_DIALOG_DATA);
  salesOrder!: SalesOrder;
  orderItems: SalesOrderItem[] = [];
  itemsTotal: number = 0;
  itemColumns: string[] = ['productName', 'quantity', 'unitPrice', 'discount', 'lineTotal', 'actions'];

  ngOnInit(): void {
    if (this.data && this.data.orderId) {
      this.salesOrderService
        .getSalesOrder(
          this.data.orderId,
          [],
          [{ name: 'skipLoading', value: 'true' }]
        )
        .subscribe((data) => {
          this.salesOrder = data;
        });

      this.loadItems();
    }
  }

  loadItems() {
    this.itemService
      .listOrderItems(
        this.data.orderId,
        [],
        [{ name: 'skipLoading', value: 'true' }]
      )
      .subscribe((data) => {
        this.orderItems = data?.items || [];
        this.itemsTotal = data?.itemsTotal || 0;
      });
  }

  openItemFormDialog(action: string, item?: SalesOrderItem) {
    const dialogRef = this.dialog.open(SalesOrderItemFormComponent, {
      disableClose: true,
      width: '800px',
      data: {
        action,
        orderId: this.data.orderId,
        item,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadItems();
      }
    });
  }

  onDeleteItem(item: SalesOrderItem) {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
    });
    confirmDialogRef.componentInstance.content = `You want to delete "${item.productName}"?`;
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.itemService
            .deleteOrderItem(
              this.data.orderId,
              String(item.pk),
              [],
              [{ name: 'skipLoading', value: 'true' }]
            )
            .pipe(
              tap((res) => {
                if (res['status'] === 1) {
                  this.toastService.showSuccessMessage('Delete order item!');
                } else {
                  this.toastService.showErrorMessage('Delete order item!');
                }
              })
            )
            .subscribe(() => {
              confirmDialogRef.close();
            });
        }
      }
    );
    confirmDialogRef.afterClosed().subscribe(() => {
      this.loadItems();
    });
  }
}
