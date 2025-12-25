import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import {
  EndpointService,
  headerObj,
  paramObj,
} from '~shared/services/endpoint.service';

import type { Contact } from '~features/contact/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly endpointService = inject(EndpointService);
  private stop$: Subject<void> = new Subject<void>();

  addContact(
    data: Contact,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService.addEndpoint(
      ENDPOINTS.contact.contact,
      paramsArr || [],
      data,
      headerOptions
    );
  }

  getListOfContacts(
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<Contact[]> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.contact.contactList,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$),
        shareReplay()
      );
  }

  getListOfContactNames(
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<Contact[]> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.contact.contactNameList,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  getContact(
    contactId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<Contact> {
    return this.endpointService
      .fetchEndpoint(
        `${ENDPOINTS.contact.contact}/${contactId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  updateContact(
    contactId: string,
    contactInfo: Contact,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .updateEndpoint(
        `${ENDPOINTS.contact.contact}/${contactId}`,
        paramsArr || [],
        contactInfo,
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  deleteContact(
    contactId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .deleteEndpoint(
        `${ENDPOINTS.contact.contact}/${contactId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  bulkDeleteContacts(
    contactIds: string[],
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .addEndpoint(
        ENDPOINTS.contact.bulkDeleteContacts,
        paramsArr || [],
        contactIds,
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  searchContacts(
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.contact.searchContact,
        paramsArr || [],
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  countContacts(
    countBy: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .fetchEndpoint(
        `${ENDPOINTS.contact.countContact}/${countBy}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }
}
