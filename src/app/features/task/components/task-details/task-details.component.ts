import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

import { TranslateModule } from '@ngx-translate/core';

import { TASK_ID } from '~features/task/task.constant';
import { Task } from '~features/task/task.interface';
import { TaskService } from '~features/task/task.service';

@Component({
  selector: 'app-task-details',
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TaskDetailsComponent>);
  private taskService = inject(TaskService);

  TASK_ID = TASK_ID;
  task!: Task;
  data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (this.data && this.data.taskId) {
      this.taskService
        .getTask(
          this.data.taskId,
          [],
          [{ name: 'skipLoading', value: 'true' }]
        )
        .subscribe((data) => {
          this.task = data;
        });
    }
  }
}
