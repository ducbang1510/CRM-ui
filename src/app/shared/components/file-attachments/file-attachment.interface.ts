export interface FileAttachment {
  id?: number;
  entityType?: string;
  entityFk?: number;
  collectionName?: string;
  mongoFileId?: string;
  fileName?: string;
  contentType?: string;
  size?: number;
  uploadedBy?: number;
  uploadedOn?: Date;
  description?: string;
  isActive?: boolean;
}
