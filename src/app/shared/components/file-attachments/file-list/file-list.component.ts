import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DialogComponent } from '~shared/components/dialog/dialog.component';
import { ToastService } from '~shared/services/toast.service';

import { FileAttachment } from '~shared/components/file-attachments/file-attachment.interface';
import { FileAttachmentService } from '~shared/components/file-attachments/file-attachment.service';

@Component({
  selector: 'app-file-list',
  imports: [
    CommonModule,
    TranslateModule,
    MatButton,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss',
})
export class FileListComponent implements OnInit {
  @Input() entityType!: string;
  @Input() entityFk!: number;
  @Input() collectionType: string = 'CONTRACT';

  private fileService = inject(FileAttachmentService);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);

  files: FileAttachment[] = [];
  fileColumns: string[] = ['fileName', 'contentType', 'size', 'uploadedOn', 'actions'];

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles() {
    if (!this.entityType || !this.entityFk) return;
    this.fileService
      .listFiles(this.entityType, this.entityFk)
      .subscribe({
        next: (data) => {
          this.files = data || [];
        },
        error: () => {
          this.files = [];
        },
      });
  }

  onUploadClick(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    this.fileService
      .uploadFile(this.entityType, this.entityFk, file, this.collectionType)
      .subscribe({
        next: () => {
          this.toastService.showSuccessMessage('Upload file!');
          this.loadFiles();
        },
        error: () => {
          this.toastService.showErrorMessage('Upload file!');
        },
      });

    // Reset input so same file can be re-uploaded
    input.value = '';
  }

  onDownload(file: FileAttachment) {
    if (!file.collectionName || !file.mongoFileId) return;
    this.fileService
      .downloadFile(file.collectionName, file.mongoFileId)
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.fileName || 'download';
          a.click();
          URL.revokeObjectURL(url);
        },
        error: () => {
          this.toastService.showErrorMessage('Download file!');
        },
      });
  }

  onDelete(file: FileAttachment) {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
    });
    confirmDialogRef.componentInstance.content = `You want to delete "${file.fileName}"?`;
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.fileService
            .deleteFile(file.id!)
            .subscribe({
              next: () => {
                this.toastService.showSuccessMessage('Delete file!');
                confirmDialogRef.close();
              },
              error: () => {
                this.toastService.showErrorMessage('Delete file!');
                confirmDialogRef.close();
              },
            });
        }
      }
    );
    confirmDialogRef.afterClosed().subscribe(() => {
      this.loadFiles();
    });
  }

  formatFileSize(bytes?: number): string {
    if (bytes == null) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
}
