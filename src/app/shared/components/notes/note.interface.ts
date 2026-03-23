export interface Note {
  pk?: number;
  entityType: string;
  entityFk: number;
  noteType: string;
  content: string;
  createdByName?: string;
  createdByFk?: number;
  createdOn?: Date;
  updatedOn?: Date;
}
