import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';

import { tap } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DialogComponent } from '~shared/components/dialog/dialog.component';
import { ToastService } from '~shared/services/toast.service';

import { Note } from '~shared/components/notes/note.interface';
import { NoteService } from '~shared/components/notes/note.service';
import { NoteFormComponent } from '~shared/components/notes/note-form/note-form.component';

@Component({
  selector: 'app-notes-list',
  imports: [
    CommonModule,
    TranslateModule,
    MatButton,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss',
})
export class NotesListComponent implements OnInit {
  @Input() entityType!: string;
  @Input() entityFk!: number;

  private noteService = inject(NoteService);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);

  notes: Note[] = [];
  noteColumns: string[] = ['noteType', 'content', 'createdByName', 'createdOn', 'actions'];

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes() {
    if (!this.entityType || !this.entityFk) return;
    this.noteService
      .listNotes(this.entityType, this.entityFk, [
        { name: 'skipLoading', value: 'true' },
      ])
      .subscribe((data) => {
        this.notes = data || [];
      });
  }

  openNoteFormDialog(action: string, note?: Note) {
    const dialogRef = this.dialog.open(NoteFormComponent, {
      disableClose: true,
      width: '600px',
      data: {
        action,
        entityType: this.entityType,
        entityFk: this.entityFk,
        note,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadNotes();
      }
    });
  }

  onDeleteNote(note: Note) {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
    });
    confirmDialogRef.componentInstance.content = `You want to delete this note?`;
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.noteService
            .deleteNote(
              String(note.pk),
              [],
              [{ name: 'skipLoading', value: 'true' }]
            )
            .pipe(
              tap((res) => {
                if (res['status'] === 1) {
                  this.toastService.showSuccessMessage('Delete the Note!');
                } else {
                  this.toastService.showErrorMessage('Delete the Note!');
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
      this.loadNotes();
    });
  }
}
