import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENDPOINTS } from '~core/constants';
import type { FileAttachment } from './file-attachment.interface';

@Injectable({
  providedIn: 'root',
})
export class FileAttachmentService {
  private readonly httpClient = inject(HttpClient);

  listFiles(entityType: string, entityFk: number): Observable<FileAttachment[]> {
    const params = new HttpParams()
      .set('entityType', entityType)
      .set('entityFk', entityFk.toString());
    return this.httpClient.get<FileAttachment[]>(ENDPOINTS.file.fileList, { params });
  }

  uploadFile(
    entityType: string,
    entityFk: number,
    file: File,
    collectionType: string,
    description?: string
  ): Observable<FileAttachment> {
    const formData = new FormData();
    formData.append('entityType', entityType);
    formData.append('entityFk', entityFk.toString());
    formData.append('file', file);
    formData.append('collectionType', collectionType);
    if (description) {
      formData.append('description', description);
    }
    // Do NOT set Content-Type header — let browser set multipart boundary
    return this.httpClient.post<FileAttachment>(ENDPOINTS.file.fileUpload, formData);
  }

  downloadFile(collectionType: string, fileId: string): Observable<Blob> {
    const params = new HttpParams()
      .set('collectionType', collectionType)
      .set('fileId', fileId);
    return this.httpClient.get(ENDPOINTS.file.fileDownload, {
      params,
      responseType: 'blob',
    });
  }

  deleteFile(pk: number): Observable<void> {
    const params = new HttpParams().set('pk', pk.toString());
    return this.httpClient.delete<void>(ENDPOINTS.file.fileDelete, { params });
  }
}
