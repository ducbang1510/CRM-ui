import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';

import { TranslateModule } from '@ngx-translate/core';

import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';
import { TableComponent } from '~shared/components/table/table.component';

import { UserFormComponent } from '~features/user/components/user-form/user-form.component';
import { USER_ID } from '~features/user/user.constant';
import { User } from '~features/user/user.interface';
import { UserService } from '~features/user/user.service';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButton,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatTableModule,
    TranslateModule,
    NoDataFoundComponent,
    TableComponent,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  @ViewChild(MatPaginator) userPaginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  private userService = inject(UserService);

  USER_ID = USER_ID;

  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'isAdmin',
    'isActive',
    'createdTime',
  ];
  headerColumns: any = [];
  totalRecords: number = 0;

  constructor() {
    this.dataSource.paginator = this.userPaginator;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.headerColumns = this.buildHeaderColumns();
    this.userService.getListOfUsers().subscribe((data) => {
      this.totalRecords = data.length;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.userPaginator;
    });
  }

  openUserDialog(action: string, userId?: string) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      disableClose: true,
      width: '900px',
      data: {
        action,
        userId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // reload list of users after close the dialog
      this.loadData();
    });
  }

  private buildHeaderColumns() {
    return [
      { key: 'name', text: 'user.table.name', type: 'text' },
      { key: 'email', text: 'user.table.email', type: 'email' },
      { key: 'phone', text: 'user.table.phone', type: 'phone' },
      {
        key: 'isAdmin',
        text: 'user.table.admin',
        type: 'boolean',
        truly: 'Admin',
        falsy: 'Employee',
      },
      {
        key: 'isActive',
        text: 'user.table.active',
        type: 'boolean',
        truly: 'Activated',
        falsy: 'Deactivated',
      },
      { key: 'createdTime', text: 'user.table.createdTime', type: 'time' },
    ];
  }
}
