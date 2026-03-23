import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { tap } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ToastService } from '~shared/services/toast.service';

import { UserService } from '~features/user/user.service';
import { TASK_ID } from '~features/task/task.constant';
import { Task } from '~features/task/task.interface';
import { User } from '~features/user/user.interface';
import { TaskService } from '~features/task/task.service';

@Component({
  selector: 'app-task-form',
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButton,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TaskFormComponent>);
  private formBuilder = inject(FormBuilder);
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  TASK_ID = TASK_ID;
  data = inject(MAT_DIALOG_DATA);
  taskForm!: FormGroup;
  taskTypes: string[] = [];
  taskStatuses: string[] = [];
  taskPriorities: string[] = [];
  assignedToUsers: User[] = [];

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      taskType: new FormControl('', [Validators.required]),
      status: new FormControl('OPEN'),
      priority: new FormControl('MEDIUM'),
      dueDate: new FormControl(''),
      assignedTo: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });

    this.taskService.getTaskTypes().subscribe((data) => {
      this.taskTypes = data || [];
    });
    this.taskService.getTaskStatuses().subscribe((data) => {
      this.taskStatuses = data || [];
    });
    this.taskService.getTaskPriorities().subscribe((data) => {
      this.taskPriorities = data || [];
    });
    this.userService
      .getListOfUserNames([], [{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        // this.assignedToUsers = (data as unknown as string[]) || [];
        this.assignedToUsers = data || [];
      });

    if (this.data && this.data.action === 'edit') {
      this.getTaskById();
    }
  }

  getTaskById() {
    this.taskService
      .getTask(
        this.data.taskId,
        [],
        [{ name: 'skipLoading', value: 'true' }]
      )
      .subscribe((data) => {
        this.setFormData(data);
      });
  }

  setFormData(data: Task) {
    this.taskForm.controls['title'].setValue(data.title || '');
    this.taskForm.controls['taskType'].setValue(
      data.taskType ? data.taskType.toUpperCase().replace(/ /g, '_') : ''
    );
    this.taskForm.controls['status'].setValue(
      data.status ? data.status.toUpperCase().replace(/ /g, '_') : ''
    );
    this.taskForm.controls['priority'].setValue(
      data.priority ? data.priority.toUpperCase().replace(/ /g, '_') : ''
    );
    this.taskForm.controls['dueDate'].setValue(data.dueDate || '');
    this.taskForm.controls['assignedTo'].setValue(data.assignedTo || '');
    this.taskForm.controls['description'].setValue(data.description || '');
  }

  onSubmit() {
    const taskInfo: Task = {
      title: this.taskForm.controls['title'].value,
      taskType: this.taskForm.controls['taskType'].value,
      status: this.taskForm.controls['status'].value,
      priority: this.taskForm.controls['priority'].value,
      dueDate: this.taskForm.controls['dueDate'].value,
      assignedTo: this.taskForm.controls['assignedTo'].value,
      description: this.taskForm.controls['description'].value,
    };

    if (this.data.action === 'add') {
      this.taskService
        .addTask(taskInfo)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage(
                'Add new Task!',
                this.TASK_ID.TOAST_ADD_SUCCESS
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Add new Task!',
                this.TASK_ID.TOAST_ADD_FAILED
              );
            }
          })
        )
        .subscribe();
    } else {
      this.taskService
        .updateTask(this.data.taskId, taskInfo)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage(
                'Update the Task!',
                this.TASK_ID.TOAST_UPDATE_SUCCESS
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Update the Task!',
                this.TASK_ID.TOAST_UPDATE_FAILED
              );
            }
          })
        )
        .subscribe();
    }
  }
}
