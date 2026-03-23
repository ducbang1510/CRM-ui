export interface Task {
  pk?: number;
  title: string;
  taskType: string;
  entityType?: string;
  entityFk?: number;
  status?: string;
  priority?: string;
  dueDate?: string;
  description?: string;
  assignedTo: string;
  assignedToUserFk?: number;
  createdBy?: string;
  createdByFk?: number;
  createdOn?: Date;
  updatedOn?: Date;
}

export interface TaskSummary {
  open: number;
  inProgress: number;
  done: number;
}
