import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import io from 'socket.io-client';

import { environment } from '~environments/environment';
import { LOCAL_STORAGE_KEYS } from '~shared/constants';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: SocketIOClient.Socket | null = null;
  private unreadCount$ = new Subject<number>();

  get unreadCountChanges$() {
    return this.unreadCount$.asObservable();
  }

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    const tokenData = window.sessionStorage.getItem(
      LOCAL_STORAGE_KEYS.OAUTH2_TOKEN
    );
    if (!tokenData) {
      return;
    }

    let accessToken = '';
    try {
      const parsed = JSON.parse(tokenData);
      accessToken = parsed?.access_token || '';
    } catch {
      return;
    }

    if (!accessToken) {
      return;
    }

    const url = new URL(environment.apiDomain);
    const socketUrl = `${url.protocol}//${url.hostname}:${environment.socketPort}`;

    this.socket = io(socketUrl, {
      query: { token: accessToken },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Socket.IO disconnected:', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.warn('Socket.IO connection error:', error.message);
    });

    this.socket.on('UNREAD_COUNT', (data: any) => {
      const count =
        typeof data === 'number' ? data : parseInt(data, 10) || 0;
      this.unreadCount$.next(count);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
