import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { marked } from 'marked';

import { Subscription } from 'rxjs';

import { AiChatService } from '../ai-chat.service';
import { ChatMessage } from '../ai-chat.interface';

@Component({
  selector: 'app-ai-chat-widget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './ai-chat-widget.component.html',
  styleUrl: './ai-chat-widget.component.scss',
})
export class AiChatWidgetComponent implements AfterViewChecked {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  private chatService = inject(AiChatService);
  private sanitizer = inject(DomSanitizer);

  isOpen = false;
  isLoading = false;
  userInput = '';
  messages: ChatMessage[] = [];
  sessionId: string = this.generateSessionId();
  private shouldScroll = false;
  private currentRequest?: Subscription;

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text) return;

    // Cancel any in-flight request before sending a new one
    this.cancelRequest();

    this.messages.push({
      role: 'user',
      content: text,
      timestamp: new Date(),
    });
    this.userInput = '';
    this.isLoading = true;
    this.shouldScroll = true;

    this.currentRequest = this.chatService.sendMessage(this.sessionId, text).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'assistant',
          content: response?.message || 'No response received.',
          timestamp: new Date(),
          toolsUsed: response?.toolsUsed || [],
        });
        this.isLoading = false;
        this.shouldScroll = true;
        this.currentRequest = undefined;
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, the AI service is currently unavailable. Please try again later.',
          timestamp: new Date(),
        });
        this.isLoading = false;
        this.shouldScroll = true;
        this.currentRequest = undefined;
      },
    });
  }

  cancelRequest(): void {
    if (this.currentRequest) {
      this.currentRequest.unsubscribe();
      this.currentRequest = undefined;
    }
    this.isLoading = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  newSession(): void {
    this.sessionId = this.generateSessionId();
    this.messages = [];
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  renderMarkdown(content: string): SafeHtml {
    const html = marked.parse(content, { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private scrollToBottom(): void {
    try {
      const el = this.messageContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch {}
  }

  private generateSessionId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
