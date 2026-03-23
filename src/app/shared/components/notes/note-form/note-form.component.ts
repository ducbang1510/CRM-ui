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
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ToastService } from '~shared/services/toast.service';
import { Note } from '~shared/components/notes/note.interface';
import { NoteService } from '~shared/components/notes/note.service';

@Component({
  selector: 'app-note-form',
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButton,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.scss',
})
export class NoteFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<NoteFormComponent>);
  private formBuilder = inject(FormBuilder);
  private noteService = inject(NoteService);
  private toastService = inject(ToastService);

  data = inject(MAT_DIALOG_DATA);
  noteForm!: FormGroup;
  noteTypes: string[] = [];

  ngOnInit(): void {
    this.noteForm = this.formBuilder.group({
      noteType: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });

    this.noteService.getNoteTypes().subscribe((data) => {
      this.noteTypes = data || [];
    });

    if (this.data && this.data.action === 'edit' && this.data.note) {
      this.noteForm.controls['noteType'].setValue(this.data.note.noteType || '');
      this.noteForm.controls['content'].setValue(this.data.note.content || '');
    }
  }

  onSubmit() {
    const noteData: Note = {
      entityType: this.data.entityType,
      entityFk: this.data.entityFk,
      noteType: this.noteForm.controls['noteType'].value,
      content: this.noteForm.controls['content'].value,
    };

    if (this.data.action === 'add') {
      this.noteService
        .addNote(noteData)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage('Add new Note!');
              this.dialogRef.close(true);
            } else {
              this.toastService.showErrorMessage('Add new Note!');
            }
          })
        )
        .subscribe();
    } else {
      this.noteService
        .updateNote(String(this.data.note.pk), noteData)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage('Update the Note!');
              this.dialogRef.close(true);
            } else {
              this.toastService.showErrorMessage('Update the Note!');
            }
          })
        )
        .subscribe();
    }
  }
}
