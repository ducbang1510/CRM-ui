import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import {
  EndpointService,
  headerObj,
  paramObj,
} from '~shared/services/endpoint.service';

import type { Note } from './note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly endpointService = inject(EndpointService);
  private readonly httpClient = inject(HttpClient);
  private stop$: Subject<void> = new Subject<void>();

  listNotes(
    entityType: string,
    entityFk: number,
    headerOptions?: headerObj[]
  ): Observable<Note[]> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.note.noteList,
        [
          { paramName: 'entityType', paramVal: entityType },
          { paramName: 'entityFk', paramVal: entityFk },
        ],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  addNote(
    data: Note,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService.addEndpoint(
      ENDPOINTS.note.note,
      paramsArr || [],
      data,
      headerOptions
    );
  }

  updateNote(
    noteId: string,
    data: Note,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .updateEndpoint(
        `${ENDPOINTS.note.note}/${noteId}`,
        paramsArr || [],
        data,
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  deleteNote(
    noteId: string,
    paramsArr?: paramObj[],
    headerOptions?: headerObj[]
  ): Observable<any> {
    return this.endpointService
      .deleteEndpoint(
        `${ENDPOINTS.note.note}/${noteId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  // Note type endpoint returns plain enum array (not wrapped in ResponseDTO)
  getNoteTypes(): Observable<string[]> {
    return this.httpClient
      .get<any[]>(`${ENDPOINTS.note.noteType}`)
      .pipe(
        map((types) =>
          types?.map((t) => (typeof t === 'string' ? t : t.name || t)) || []
        )
      );
  }
}
