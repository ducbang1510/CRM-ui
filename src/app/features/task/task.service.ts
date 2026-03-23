import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import {
  EndpointService,
  headerObj,
  paramObj,
} from '~shared/services/endpoint.service';

import type { Task, TaskSummary } from '~features/task/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly endpointService = inject(EndpointService);
  private readonly httpClient = inject(HttpClient);
  private stop$: Subject<void> = new Subject<void>();

  getMyTasks(
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<{ totalPages: number; currentPage: number; tasks: Task[] }> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.task.myTasks,
        paramsArr || [
          { paramName: 'pageNumber', paramVal: 0 },
          { paramName: 'pageSize', paramVal: 100 },
        ],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  getTask(
    taskId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<Task> {
    return this.endpointService
      .fetchEndpoint(
        `${ENDPOINTS.task.task}/${taskId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  getTaskSummary(
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<TaskSummary> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.task.taskSummary,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  addTask(
    data: Task,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService.addEndpoint(
      ENDPOINTS.task.task,
      paramsArr || [],
      data,
      headerOptions
    );
  }

  updateTask(
    taskId: string,
    taskInfo: Task,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .updateEndpoint(
        `${ENDPOINTS.task.task}/${taskId}`,
        paramsArr || [],
        taskInfo,
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  deleteTask(
    taskId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .deleteEndpoint(
        `${ENDPOINTS.task.task}/${taskId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  // Enum endpoints return plain arrays (not wrapped in ResponseDTO)
  getTaskTypes(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${ENDPOINTS.task.taskType}`);
  }

  getTaskStatuses(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${ENDPOINTS.task.taskStatus}`);
  }

  getTaskPriorities(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${ENDPOINTS.task.taskPriority}`);
  }
}
