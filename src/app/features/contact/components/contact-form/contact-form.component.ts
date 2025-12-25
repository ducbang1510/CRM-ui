import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { tap } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import { MatNativeDateModule } from '@angular/material/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { LOCAL_STORAGE_KEYS } from '~shared/constants';
import { ToastService } from '~shared/services/toast.service';

import { CONTACT_ID } from '~features/contact/contact.constant';
import { Contact } from '~features/contact/contact.interface';
import { ContactService } from '~features/contact/contact.service';
import { User } from '~features/user/user.interface';
import { UserService } from '~features/user/user.service';

@Component({
  selector: 'app-contact-form',
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
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ContactFormComponent>);
  private formBuilder = inject(FormBuilder);
  private contactService = inject(ContactService);
  private toastService = inject(ToastService);
  private userService = inject(UserService);

  CONTACT_ID = CONTACT_ID;
  data = inject(MAT_DIALOG_DATA);
  salutations: string[] = ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
  leadSources: string[] = [
    'Existing Customer',
    'Partner',
    'Conference',
    'Website',
    'Word of mouth',
    'Other',
  ];
  contactForm!: FormGroup;
  assignedToUsers: User[] = [];
  // retain created time when editing Sales order
  createdTime = new Date();

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      contactName: new FormControl('', [Validators.required]),
      salutation: new FormControl('', [Validators.required]),
      mobilePhone: new FormControl('', [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      email: new FormControl('', [Validators.email]),
      organization: new FormControl(''),
      dob: new FormControl(''),
      leadSrc: new FormControl('', [Validators.required]),
      assignedTo: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      description: new FormControl(''),
    });

    this.userService
      .getListOfUserNames([], [{ name: 'skipLoading', value: 'true' }])
      .subscribe((data) => {
        this.assignedToUsers = data || [];
      });

    if (this.data && this.data.action === 'edit') {
      this.getContactById();
    }
  }

  getContactById() {
    this.contactService
      .getContact(
        this.data.contactId,
        [],
        [{ name: 'skipLoading', value: 'true' }]
      )
      .subscribe((data) => {
        this.setFormData(data);
      });
  }

  setFormData(data: Contact) {
    this.contactForm.controls['contactName'].setValue(
      data['contactName'] || ''
    );
    this.contactForm.controls['salutation'].setValue(data['salutation'] || '');
    this.contactForm.controls['mobilePhone'].setValue(
      data['mobilePhone'] || ''
    );
    this.contactForm.controls['email'].setValue(data['email'] || '');
    this.contactForm.controls['organization'].setValue(
      data['organization'] || ''
    );
    this.contactForm.controls['dob'].setValue(data['dob'] || '');
    this.contactForm.controls['leadSrc'].setValue(data['leadSrc'] || '');
    this.contactForm.controls['assignedTo'].setValue(data['assignedTo'] || '');
    this.contactForm.controls['address'].setValue(data['address'] || '');
    this.contactForm.controls['description'].setValue(
      data['description'] || ''
    );
    this.createdTime = data['createdTime'] || new Date();
  }

  onSubmit() {
    const currentUserInfo = window.localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    const contactInfo: Contact = {
      contactName: this.contactForm.controls['contactName'].value,
      salutation: this.contactForm.controls['salutation'].value,
      mobilePhone: this.contactForm.controls['mobilePhone'].value,
      email: this.contactForm.controls['email'].value,
      organization: this.contactForm.controls['organization'].value,
      dob: this.contactForm.controls['dob'].value,
      leadSrc: this.contactForm.controls['leadSrc'].value,
      assignedTo: this.contactForm.controls['assignedTo'].value,
      address: this.contactForm.controls['address'].value,
      description: this.contactForm.controls['description'].value,
      creator: currentUserInfo && (JSON.parse(currentUserInfo).name || ''),
      createdTime:
        this.data && this.data.action === 'add' ? new Date() : this.createdTime,
      updatedTime: new Date(),
    };
    if (this.data.action === 'add') {
      this.contactService
        .addContact(contactInfo)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage(
                'Add new Contact!',
                this.CONTACT_ID.TOAST_ADD_SUCCESS
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Add new Contact!',
                this.CONTACT_ID.TOAST_ADD_FAILED
              );
            }
          })
        )
        .subscribe();
    } else {
      this.contactService
        .updateContact(this.data.contactId, contactInfo)
        .pipe(
          tap((res) => {
            if (res['status'] === 1) {
              this.toastService.showSuccessMessage(
                'Update the Contact!',
                this.CONTACT_ID.TOAST_UPDATE_SUCCESS
              );
              this.dialogRef.close();
            } else {
              this.toastService.showErrorMessage(
                'Update the Contact!',
                this.CONTACT_ID.TOAST_UPDATE_FAILED
              );
            }
          })
        )
        .subscribe();
    }
  }
}
