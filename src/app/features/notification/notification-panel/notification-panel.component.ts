import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { NotificationService } from '../notification.service';
import { NotificationMessage } from '../notification.interface';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './notification-panel.component.html',
  styleUrl: './notification-panel.component.scss',
})
export class NotificationPanelComponent implements OnInit {
  private notificationService = inject(NotificationService);

  notifications: NotificationMessage[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotifications(0, 20).subscribe({
      next: (data) => {
        this.notifications = data?.recordList || [];
        this.loading = false;
      },
      error: () => {
        this.notifications = [];
        this.loading = false;
      },
    });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'CONTACT_ASSIGNED':
        return 'person_add';
      case 'CONTACT_UPDATED':
        return 'contact_page';
      case 'SALES_ORDER_ASSIGNED':
        return 'assignment_ind';
      case 'SALES_ORDER_UPDATED':
        return 'receipt_long';
      default:
        return 'notifications';
    }
  }
}
