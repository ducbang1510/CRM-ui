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

import { TaskDetailsComponent } from '~features/task/components/task-details/task-details.component';
import { TaskFormComponent } from '~features/task/components/task-form/task-form.component';
import { TASK_ID } from '~features/task/task.constant';
import { Task, TaskSummary } from '~features/task/task.interface';
import { TaskService } from '~features/task/task.service';

@Component({
  selector: 'app-task',
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
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {
  @ViewChild(MatPaginator) taskPaginator!: MatPaginator;
  TASK_ID = TASK_ID;
  displayedColumns: string[] = [
    'title',
    'taskType',
    'status',
    'priority',
    'dueDate',
    'assignedTo',
    'createdOn',
    'actions',
  ];
  dataSource = new MatTableDataSource<Task>([]);
  totalRecords: number = 0;
  searchText: FormControl = new FormControl('');
  summary: TaskSummary = { open: 0, inProgress: 0, done: 0 };

  constructor(
    protected taskService: TaskService,
    public dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadSummary();
  }

  loadData() {
    this.taskService.getMyTasks().subscribe((data) => {
      let tasks = data?.tasks || [];
      const searchVal = this.searchText.value?.trim().toLowerCase();
      if (searchVal) {
        tasks = tasks.filter(
          (t) =>
            t.title?.toLowerCase().includes(searchVal) ||
            t.assignedTo?.toLowerCase().includes(searchVal)
        );
      }
      this.totalRecords = tasks.length;
      this.dataSource = new MatTableDataSource(tasks);
      this.dataSource.paginator = this.taskPaginator;
    });
  }

  loadSummary() {
    this.taskService
      .getTaskSummary([], [{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        this.summary = data || { open: 0, inProgress: 0, done: 0 };
      });
  }

  resetData() {
    this.searchText = new FormControl('');
    this.loadData();
  }

  onSearch() {
    this.loadData();
  }

  openFormDialog(action: string, taskId?: string) {
    const formDialogRef = this.dialog.open(TaskFormComponent, {
      disableClose: true,
      width: '1200px',
      data: {
        action,
        taskId,
      },
    });
    formDialogRef.afterClosed().subscribe(() => {
      this.loadData();
      this.loadSummary();
    });
  }

  openTaskDetailsDialog(taskId: string) {
    this.dialog.open(TaskDetailsComponent, {
      disableClose: true,
      width: '600px',
      data: {
        taskId,
      },
    });
  }

  onDelete(taskId: string, taskTitle: string) {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
    });
    confirmDialogRef.componentInstance.content = `You want to delete the "${taskTitle}"?`;
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.taskService
            .deleteTask(
              taskId,
              [],
              [{ name: 'skipLoading', value: 'true' }]
            )
            .pipe(
              tap((res) => {
                if (res['status'] === 1) {
                  this.toastService.showSuccessMessage(
                    'Delete the Task!',
                    this.TASK_ID.TOAST_DELETE_SUCCESS
                  );
                } else {
                  this.toastService.showErrorMessage(
                    'Delete the Task!',
                    this.TASK_ID.TOAST_DELETE_FAILED
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
    confirmDialogRef.afterClosed().subscribe(() => {
      this.loadData();
      this.loadSummary();
    });
  }
}
