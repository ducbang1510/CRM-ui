import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  startWith,
  switchMap,
} from 'rxjs/operators';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from '@ngx-translate/core';

import { DialogComponent } from '~shared/components/dialog/dialog.component';
import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';
import { ToastService } from '~shared/services/toast.service';

import { SALES_ORDER_ID } from '~features/sales-order/sales-order.constant';
import {
  FilterCriteria,
  SalesOrder,
} from '~features/sales-order/sales-order.interface';
import { SalesOrderDetailsComponent } from '~features/sales-order/components/sales-order-details/sales-order-details.component';
import { SalesOrderFilterGroupDialogComponent } from '~features/sales-order/components/sales-order-filter-group-dialog/sales-order-filter-group-dialog.component';
import { SalesOrderFormComponent } from '~features/sales-order/components/sales-order-form/sales-order-form.component';
import { SalesOrderService } from '~features/sales-order/sales-order.service';

@Component({
  selector: 'app-sales-order',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    TranslateModule,
    NoDataFoundComponent,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.scss',
})
export class SalesOrderComponent implements OnInit {
  @ViewChild(MatPaginator) salesOrderPaginator!: MatPaginator;
  SALES_ORDER_ID = SALES_ORDER_ID;
  displayedColumns: string[] = [
    'select',
    'subject',
    'contactName',
    'status',
    'total',
    'assignedTo',
    'createdTime',
    'updatedTime',
    'actions',
  ];
  statusNames: string[] = ['Created', 'Approved', 'Delivered', 'Canceled'];
  statusFromDashboard: string = '';
  dataSource = new MatTableDataSource<SalesOrder>([]);
  totalRecords: number = 0;
  searchText: FormControl = new FormControl('');
  search$!: Observable<SalesOrder[]>;
  filterSubject: BehaviorSubject<FilterCriteria> =
    new BehaviorSubject<FilterCriteria>({});
  orderIdsChecked: string[] = [];

  constructor(
    private router: Router,
    protected salesOrderService: SalesOrderService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    // clear params (status) before get all data
    this.router.navigateByUrl('/sales-order');
    // get status passed from dashboard page
    this.route.queryParams.subscribe((params) => {
      if (params['status']) {
        this.statusFromDashboard = params['status'];
        // this.status = new FormControl(this.statusFromDashboard);
        // this.applySelectFilter(this.status.value, 'status');
      }
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.search$ = this.searchText.valueChanges.pipe(
      startWith(''),
      tap((subject) => {
        // handle the search value before doing any futher steps
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((subject) =>
        subject
          ? this.salesOrderService.searchSalesOrders([
              { paramName: 'subject', paramVal: subject },
            ])
          : of(null)
      )
    );

    combineLatest([this.salesOrderService.getListOfSalesOrders(), this.search$])
      .pipe(
        map(([contacts, searchResult]) => {
          const sourceData = searchResult
            ? (searchResult as { [key: string]: any })['data']
            : contacts;
          return sourceData;
        })
      )
      .subscribe((data) => {
        this.totalRecords = data.length;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.salesOrderPaginator;
      });
  }

  resetData() {
    this.searchText = new FormControl('');
    this.filterSubject.next({});
    this.loadData();
  }

  openFilterGroupDialog() {
    const filterDialogRef = this.dialog.open(
      SalesOrderFilterGroupDialogComponent,
      {
        disableClose: true,
        width: '600px',
      }
    );
    filterDialogRef.afterClosed().subscribe((result) => {});
  }

  openFormDialog(action: string, orderId?: string) {
    const formDialogRef = this.dialog.open(SalesOrderFormComponent, {
      disableClose: true,
      width: '1200px',
      data: {
        action,
        orderId,
      },
    });
    formDialogRef.afterClosed().subscribe((result) => {
      this.loadData();
    });
  }

  openSalesOrderDetailsDialog(orderId: string) {
    const salesOrderDetailsDialogRef = this.dialog.open(
      SalesOrderDetailsComponent,
      {
        disableClose: true,
        width: '900px',
        data: {
          orderId,
        },
      }
    );
    salesOrderDetailsDialogRef.afterClosed().subscribe((result) => {});
  }

  onDelete(orderId: string, subject: string) {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
    });
    confirmDialogRef.componentInstance.content = `You want to delete the "${subject}"?`;
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.salesOrderService
            .deleteSalesOrder(
              orderId,
              [],
              [{ name: 'skipLoading', value: 'true' }]
            )
            .pipe(
              tap((res) => {
                if (res['status'] === 1) {
                  this.toastService.showSuccessMessage(
                    'Delete the Sales order!'
                  );
                } else {
                  this.toastService.showErrorMessage('Delete the Sales order!');
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

  onBulkDeleteSalesOrders() {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
    });
    confirmDialogRef.componentInstance.content = `You want to delete the sales orders?`;
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.salesOrderService
            .bulkDeleteSalesOrder(
              this.orderIdsChecked,
              [],
              [{ name: 'skipLoading', value: 'true' }]
            )
            .pipe(
              tap((res) => {
                if (res['status'] === 1) {
                  this.toastService.showSuccessMessage(
                    'Delete the Sales orders!'
                  );
                } else {
                  this.toastService.showErrorMessage(
                    'Delete the Sales orders!'
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
      this.orderIdsChecked = [];
      this.loadData();
    });
  }

  onCheckboxChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const orderId = (event.target as HTMLInputElement).value;
    if (isChecked) {
      // add the checked value to array
      this.orderIdsChecked.push(orderId);
    } else {
      // remove the unchecked value from array
      this.orderIdsChecked.splice(this.orderIdsChecked.indexOf(orderId), 1);
    }
  }

  applySelectFilter(filterValue: string, filterBy: string) {
    const currentFilterObj = this.filterSubject.getValue();
    this.filterSubject.next({ ...currentFilterObj, [filterBy]: filterValue });
  }
}
