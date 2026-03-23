import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

import { TranslateModule } from '@ngx-translate/core';

import { DASHBOARD_ID } from '~features/dashboard/dashboard.constant';
import { ContactService } from '~features/contact/contact.service';
import { SalesOrderService } from '~features/sales-order/sales-order.service';
import { DashboardService } from '~features/dashboard/dashboard.service';
import { RevenueTrend, PipelineSummary, TopUser } from '~features/dashboard/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TranslateModule, MatCardModule, MatTableModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) contactChart!: BaseChartDirective;
  @ViewChild(BaseChartDirective) salesOrderChart!: BaseChartDirective;
  contactService = inject(ContactService);
  salesOrderService = inject(SalesOrderService);
  dashboardService = inject(DashboardService);

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

  // Revenue Trend bar chart
  revenueTrendLabels: string[] = [];
  revenueTrendDatasets: { data: number[]; label: string }[] = [
    { data: [], label: 'Revenue' },
  ];
  revenueTrendOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Pipeline Summary
  pipelineSummary: PipelineSummary[] = [];
  pipelineColumns: string[] = ['status', 'orderCount', 'totalRevenue'];

  // Top Users
  topUsers: TopUser[] = [];
  topUserColumns: string[] = ['rank', 'userName', 'orderCount', 'totalRevenue'];

  ngOnInit(): void {
    this.loadContactChartData();
    this.loadSalesOrderChartData();
    this.loadRevenueTrend();
    this.loadPipelineSummary();
    this.loadTopUsers();
  }

  loadContactChartData() {
    this.contactService.countContacts('lead-source').subscribe((data) => {
      this.contactPieChartDatasets = [...this.contactPieChartDatasets];
      (data || []).forEach((item: { [key: string]: any }) => {
        const index = this.contactPieChartLabels.indexOf(item['id']);
        if (index >= 0) {
          this.contactPieChartDatasets[0].data[index] = item['count'];
        }
      });
      this.contactChart?.update();
    });
  }

  loadSalesOrderChartData() {
    this.salesOrderService.countSalesOrder('status').subscribe((data) => {
      this.salesOrderPieChartDatasets = [...this.salesOrderPieChartDatasets];
      (data || []).forEach((item: { [key: string]: any }) => {
        const index = this.salesOrderPieChartLabels.indexOf(item['id']);
        if (index >= 0) {
          this.salesOrderPieChartDatasets[0].data[index] = item['count'];
        }
      });
      this.salesOrderChart?.update();
    });
  }

  loadRevenueTrend() {
    this.dashboardService
      .getRevenueTrend(12, [{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        const trends = data || [];
        this.revenueTrendLabels = trends.map((t) => t.period || '');
        this.revenueTrendDatasets = [
          { data: trends.map((t) => t.revenue || 0), label: 'Revenue' },
        ];
      });
  }

  loadPipelineSummary() {
    this.dashboardService
      .getPipelineSummary([{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        this.pipelineSummary = data || [];
      });
  }

  loadTopUsers() {
    this.dashboardService
      .getTopUsers(5, [{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        this.topUsers = data || [];
      });
  }
}
