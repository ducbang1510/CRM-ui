import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

import { TranslateModule } from '@ngx-translate/core';

import { FileListComponent } from '~shared/components/file-attachments/file-list/file-list.component';
import { NotesListComponent } from '~shared/components/notes/notes-list/notes-list.component';
import { CONTACT_ID } from '~features/contact/contact.constant';
import { Contact } from '~features/contact/contact.interface';
import { ContactService } from '~features/contact/contact.service';

@Component({
  selector: 'app-contact-details',
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    FileListComponent,
    NotesListComponent,
  ],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ContactDetailsComponent>);
  private contactService = inject(ContactService);
  
  CONTACT_ID = CONTACT_ID;
  contact!: Contact;
  data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (this.data && this.data.contactId) {
      this.contactService
        .getContact(
          this.data.contactId,
          [],
          [{ name: 'skipLoading', value: 'true' }]
        )
        .subscribe((data) => {
          this.contact = data;
        });
    }
  }
}
