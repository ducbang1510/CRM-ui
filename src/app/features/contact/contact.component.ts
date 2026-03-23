import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from '@ngx-translate/core';

import { DialogComponent } from '~shared/components/dialog/dialog.component';
import { NoDataFoundComponent } from '~shared/components/no-data-found/no-data-found.component';
import { ToastService } from '~shared/services/toast.service';

import { ContactDetailsComponent } from '~features/contact/components/contact-details/contact-details.component';
import { ContactFormComponent } from '~features/contact/components/contact-form/contact-form.component';
import { CONTACT_ID } from '~features/contact/contact.constant';
import { Contact, FilterCriteria } from '~features/contact/contact.interface';
import { ContactService } from '~features/contact/contact.service';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    NoDataFoundComponent,
    TranslateModule,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  @ViewChild(MatPaginator) contactPaginator!: MatPaginator;
  CONTACT_ID = CONTACT_ID;
  displayedColumns: string[] = [
    'select',
    'contactName',
    'salutation',
    'leadSrc',
    'assignedTo',
    'createdTime',
    'updatedTime',
    'actions',
  ];
  leadSources: string[] = [
    'Existing Customer',
    'Partner',
    'Conference',
    'Website',
    'Word of mouth',
    'Other',
  ];
  dataSource = new MatTableDataSource<Contact>([]);
  totalRecords: number = 0;
  contactIdsChecked: string[] = [];
  searchText: FormControl = new FormControl('');
  search$!: Observable<Contact[]>;
  filterSubject: BehaviorSubject<FilterCriteria> =
    new BehaviorSubject<FilterCriteria>({});

  constructor(
    private router: Router,
    protected contactService: ContactService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    // clear params (leadSrc or assignedTo) before get all data
    this.router.navigateByUrl('/contact');
    // get lead source passed from dashboard page
    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params['leadSrc']) {
          // this.leadSrcFromDashboard = params['leadSrc'];
          // this.leadSrc = new FormControl(this.leadSrcFromDashboard);
        }
        if (params['assignedTo']) {
          // this.assignedFromDashboard = params['assignedTo'];
          // this.assignedTo = new FormControl(this.assignedFromDashboard);
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.search$ = this.searchText.valueChanges.pipe(
      startWith(''),
      tap((contactName) => {
        // handle the search value before doing any further steps
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((contactName) =>
        contactName
          ? this.contactService.searchContacts([
              { paramName: 'contactName', paramVal: contactName },
            ])
          : of(null)
      )
    );

    combineLatest([this.contactService.getListOfContacts(), this.search$])
      .pipe(
        map(([contacts, searchResult]) => {
          const sourceData = searchResult
            ? (searchResult as { [key: string]: any })['data']
            : contacts;
          return sourceData;
        })
      )
      .subscribe((data) => {
        this.totalRecords = data.length;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.contactPaginator;
      });
  }

  resetData() {
    this.filterSubject.next({});
    this.searchText = new FormControl('');
    this.loadData();
  }

  openFormDialog(action: string, contactId?: string) {
    const formDialogRef = this.dialog.open(ContactFormComponent, {
      disableClose: true,
      width: '1200px',
      data: {
        action,
        contactId,
      },
    });
    formDialogRef.afterClosed().subscribe((result) => {
      this.loadData();
    });
  }

  openContactDetailsDialog(contactId: string) {
    const contactDetailsDialogRef = this.dialog.open(ContactDetailsComponent, {
      disableClose: true,
      width: '600px',
      data: {
        contactId,
      },
    });
    contactDetailsDialogRef.afterClosed().subscribe((result) => {});
  }

  onDelete(contactId: string, contactName: string) {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
    });
    confirmDialogRef.componentInstance.content = `You want to delete the "${contactName}"?`;
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.contactService
            .deleteContact(
              contactId,
              [],
              [{ name: 'skipLoading', value: 'true' }]
            )
            .pipe(
              tap((res) => {
                if (res['status'] === 1) {
                  this.toastService.showSuccessMessage(
                    'Delete the Contact!',
                    this.CONTACT_ID.TOAST_DELETE_SUCCESS
                  );
                } else {
                  this.toastService.showErrorMessage(
                    'Delete the Contact!',
                    this.CONTACT_ID.TOAST_DELETE_FAILED
                  );
                }
              })
            )
            .subscribe(() => {
              confirmDialogRef.close();
            });
        }
      }
    );
    confirmDialogRef.afterClosed().subscribe((result) => {
      this.loadData();
    });
  }

  onBulkDeleteContacts() {
    const confirmDialogRef = this.dialog.open(DialogComponent, {
      disableClose: false,
    });
    confirmDialogRef.componentInstance.content = `You want to delete the contacts?`;
    confirmDialogRef.componentInstance.sendingSubmitSignal.subscribe(
      (signal) => {
        if (signal) {
          this.contactService
            .bulkDeleteContacts(
              this.contactIdsChecked,
              [],
              [{ name: 'skipLoading', value: 'true' }]
            )
            .pipe(
              tap((res) => {
                if (res['status'] === 1) {
                  this.toastService.showSuccessMessage(
                    'Delete the Contacts!',
                    this.CONTACT_ID.TOAST_DELETE_MULTIPLE_SUCCESS
                  );
                } else {
                  this.toastService.showErrorMessage(
                    'Delete the Contacts!',
                    this.CONTACT_ID.TOAST_DELETE_MULTIPLE_SUCCESS
                  );
                }
              })
            )
            .subscribe(() => {
              confirmDialogRef.close();
            });
        }
      }
    );
    confirmDialogRef.afterClosed().subscribe((result) => {
      this.contactIdsChecked = [];
      this.loadData();
    });
  }

  onCheckboxChecked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const contactId = (event.target as HTMLInputElement).value;
    if (isChecked) {
      // add the checked value to array
      this.contactIdsChecked.push(contactId);
    } else {
      // remove the unchecked value from array
      this.contactIdsChecked.splice(
        this.contactIdsChecked.indexOf(contactId),
        1
      );
    }
  }

  applySelectFilter(filterValue: string, filterBy: string) {
    const currentFilterObj = this.filterSubject.getValue();
    this.filterSubject.next({ ...currentFilterObj, [filterBy]: filterValue });
  }
}
