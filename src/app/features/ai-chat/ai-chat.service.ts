import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { EndpointService } from '~shared/services/endpoint.service';
import { ENDPOINTS } from '~core/constants/endpoints.constant';
import { AiChatResponse } from './ai-chat.interface';

@Injectable({
  providedIn: 'root',
})
export class AiChatService {
  private endpointService = inject(EndpointService);
  private stop$ = new Subject<void>();

  sendMessage(sessionId: string, message: string): Observable<AiChatResponse> {
    return this.endpointService
      .addEndpoint(ENDPOINTS.ai.chat, [], { sessionId, message }, [
        { name: 'skipLoading', value: 'true' },
      ])
      .pipe(
        map((res) => res?.['data'] || { sessionId, message: '', model: null, toolsUsed: [] }),
        takeUntil(this.stop$)
      );
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
