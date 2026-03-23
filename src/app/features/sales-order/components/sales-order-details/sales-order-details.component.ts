import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

import { TranslateModule } from '@ngx-translate/core';

import { SALES_ORDER_ID } from '~features/sales-order/sales-order.constant';
import { SalesOrder } from '~features/sales-order/sales-order.interface';
import { SalesOrderService } from '~features/sales-order/sales-order.service';

@Component({
  selector: 'app-sales-order-details',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    TranslateModule,
  ],
  templateUrl: './sales-order-details.component.html',
  styleUrl: './sales-order-details.component.scss',
})
export class SalesOrderDetailsComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SalesOrderDetailsComponent>);
  private salesOrderService = inject(SalesOrderService);

  SALES_ORDER_ID = SALES_ORDER_ID;
  data = inject(MAT_DIALOG_DATA);
  salesOrder!: SalesOrder;

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
    }
  }
}
