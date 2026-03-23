import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

import { ENDPOINTS } from '~core/constants';
import { EndpointService } from '~shared/services/endpoint.service';

import { User } from '~features/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly endpointService = inject(EndpointService);
  private stop$: Subject<void> = new Subject<void>();

  addNewUser(
    data: User,
    paramsArr?: any[],
    headerOptions?: any[]
  ): Observable<any> {
    return this.endpointService.addEndpoint(
      ENDPOINTS.user.user,
      paramsArr || [],
      data,
      headerOptions
    );
  }

  createUser(
    data: User,
    paramsArr?: any[],
    headerOptions?: any[]
  ): Observable<any> {
    return this.endpointService.addEndpoint(
      ENDPOINTS.user.createUser,
      paramsArr || [],
      data,
      headerOptions
    );
  }

  getListOfUsers(paramsArr?: any[], headerOptions?: any[]): Observable<User[]> {
    return this.endpointService
      .fetchEndpoint(ENDPOINTS.user.userList, paramsArr || [], headerOptions)
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$),
        shareReplay()
      );
  }

  getListOfUserNames(
    paramsArr?: any[],
    headerOptions?: any[]
  ): Observable<User[]> {
    return this.endpointService
      .fetchEndpoint(
        ENDPOINTS.user.userNamesList,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  getUser(
    userId: string,
    paramsArr?: any[],
    headerOptions?: any[]
  ): Observable<User> {
    return this.endpointService
      .fetchEndpoint(
        `${ENDPOINTS.user.user}/${userId}`,
        paramsArr || [],
        headerOptions
      )
      .pipe(
        map((res) => res['data']),
        takeUntil(this.stop$)
      );
  }

  updateUser(
    userId: string,
    userInfo: User,
    paramsArr?: any[],
    headerOptions?: any[]
  ): Observable<any> {
    return this.endpointService
      .updateEndpoint(
        `${ENDPOINTS.user.user}/${userId}`,
        paramsArr || [],
        userInfo,
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  changePassword(
    userId: string,
    newPass: string,
    paramsArr?: any[],
    headerOptions?: any[]
  ): Observable<void> {
    return this.endpointService
      .addEndpoint(
        `${ENDPOINTS.user.user}/${userId}`,
        paramsArr || [],
        { newPass },
        headerOptions
      )
      .pipe(takeUntil(this.stop$));
  }

  changeUserPassword(
    oldPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.endpointService
      .updateEndpoint(
        ENDPOINTS.user.user,
        [],
        { oldPassword, newPassword }
      )
      .pipe(takeUntil(this.stop$));
  }

  // stop subcriptions
  stop() {
    this.stop$.next();
    this.stop$.complete();
  }
}
