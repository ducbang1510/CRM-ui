import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

import { TranslateModule } from '@ngx-translate/core';

import { DASHBOARD_ID } from '~features/dashboard/dashboard.constant';
import { ContactService } from '~features/contact/contact.service';
import { SalesOrderService } from '~features/sales-order/sales-order.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TranslateModule, MatCardModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) contactChart!: BaseChartDirective;
  @ViewChild(BaseChartDirective) salesOrderChart!: BaseChartDirective;
  contactService = inject(ContactService);
  salesOrderService = inject(SalesOrderService);

  DASHBOARD_ID = DASHBOARD_ID;
  // Pie chart for contact
  contactPieChartLabels: string[] = [
    'Existing Customer',
    'Partner',
    'Conference',
    'Website',
    'Word of mouth',
    'Other',
  ];
  contactPieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  contactPieChartDatasets = [
    {
      data: [0, 0, 0, 0, 0, 0],
    },
  ];

  // Pie chart for Sales order
  salesOrderPieChartLabels: string[] = [
    'Created',
    'Approved',
    'Delivered',
    'Canceled',
  ];
  salesOrderPieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  salesOrderPieChartDatasets = [
    {
      data: [0, 0, 0, 0, 0, 0],
    },
  ];

  ngOnInit(): void {
    this.loadContactChartData();
    this.loadSalesOrderChartData();
  }

  loadContactChartData() {
    this.contactService.countContacts('lead-source').subscribe((data) => {
      this.contactPieChartDatasets = [...this.contactPieChartDatasets];
      data.forEach((item: { [key: string]: any }) => {
        const index = this.contactPieChartLabels.indexOf(item['id']);
        this.contactPieChartDatasets[0].data[index] = item['count'];
      });
      // Force chart update
      this.contactChart.update();
    });
  }

  loadSalesOrderChartData() {
    this.salesOrderService.countSalesOrder('status').subscribe((data) => {
      this.salesOrderPieChartDatasets = [...this.salesOrderPieChartDatasets];
      data.forEach((item: { [key: string]: any }) => {
        const index = this.salesOrderPieChartLabels.indexOf(item['id']);
        this.salesOrderPieChartDatasets[0].data[index] = item['count'];
      });
      // Force chart update
      this.salesOrderChart.update();
    });
  }
}
