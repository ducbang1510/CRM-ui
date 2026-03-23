import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from '@ngx-translate/core';

import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';
import { ToastService } from '~shared/services/toast.service';

import { REPORT_ID } from '~features/report/report.constant';
import { DailySalesReport } from '~features/report/report.interface';
import { ReportService } from '~features/report/report.service';

@Component({
  selector: 'app-report',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
    MatTooltipModule,
    NoDataFoundComponent,
    TranslateModule,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent implements OnInit {
  private reportService = inject(ReportService);
  private toastService = inject(ToastService);

  REPORT_ID = REPORT_ID;
  fromDate: Date | null = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  toDate: Date | null = new Date();
  reports: DailySalesReport[] = [];
  displayedColumns: string[] = [
    'reportDate',
    'totalRevenue',
    'totalOrders',
    'ordersCreated',
    'ordersApproved',
    'ordersDelivered',
    'ordersCanceled',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch() {
    if (!this.fromDate || !this.toDate) return;
    const from = this.formatDate(this.fromDate);
    const to = this.formatDate(this.toDate);
    this.reportService.listReports(from, to).subscribe((data) => {
      this.reports = data || [];
    });
  }

  onDownload(report: DailySalesReport) {
    if (!report.reportDate) return;
    this.reportService.downloadReport(report.reportDate).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = report.fileName || `daily_sales_report_${report.reportDate}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        this.toastService.showErrorMessage('Download report!');
      },
    });
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
