import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { TranslateModule } from '@ngx-translate/core';

// import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';

@Component({
  selector: 'app-table',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    TranslateModule,
    // NoDataFoundComponent,
  ],
  providers: [DatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any;
  @Input() headerColumns: any = [];
  @Input() tableId: string = 'app-table';
  @Input() totalRecords: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private datePipe = inject(DatePipe);
  formattedDate: string = 'medium';

  ngOnInit(): void {}

  getTableData(row: Record<string, any>, column: Record<string, any>) {
    const cellType = column['type'];
    const cellValue = row[column['key']];

    if (cellType === 'time') {
      return this.datePipe.transform(cellValue, this.formattedDate);
    }
    if (cellType === 'boolean') {
      return cellValue === true ? column['truly'] : column['falsy'];
    }
    return cellValue;
  }
}
