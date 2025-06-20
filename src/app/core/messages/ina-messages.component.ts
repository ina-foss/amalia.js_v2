import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { InaMessage, MessageSeverity } from './ina-messages.model';

@Component({
  selector: 'ina-messages',
  templateUrl: './ina-messages.component.html',
  styleUrls: ['./ina-messages.component.scss'],
  standalone: true,
  imports: [CommonModule, MessagesModule]
})
export class InaMessagesComponent {
  @Input() key: string = 'ina-messages';
  @Input() closable: boolean = true;
  @Input() enableIcon: boolean = true;
  @Input() escape: boolean = true;
  @Input() styleClass: string = '';
  @Input() sticky: boolean = true;
  @Input() life: number = 6000;

  readonly messages = signal<Message[]>([]);

  readonly severityConfig = [
    {
      severity: 'success' as const,
      iconClass: 'pi pi-check',
      containerClass: 'p-message-success'
    },
    {
      severity: 'error' as const,
      iconClass: 'pi pi-times',
      containerClass: 'p-message-error'
    },
    {
      severity: 'info' as const,
      iconClass: 'pi pi-info',
      containerClass: 'p-message-info'
    },
    {
      severity: 'warn' as const,
      iconClass: 'pi pi-exclamation-triangle',
      containerClass: 'p-message-warn'
    }
  ] as const;

  showSuccess(detail: string, summary?: string): void {
    this.showMessage('success', detail, summary);
  }

  showError(detail: string, summary?: string): void {
    this.showMessage('error', detail, summary);
  }

  showInfo(detail: string, summary?: string): void {
    this.showMessage('info', detail, summary);
  }

  showWarn(detail: string, summary?: string): void {
    this.showMessage('warn', detail, summary);
  }

  addMessage(message: InaMessage): void {
    const config = this.severityConfig.find(cfg => cfg.severity === message.severity);

    const primengMessage: Message = {
      severity: message.severity,
      summary: message.summary,
      detail: message.detail,
      closable: message.closable ?? this.closable,
      sticky: message.sticky ?? this.sticky,
      key: message.key ?? this.key,
      icon: this.enableIcon && config ? config.iconClass : undefined
    };

    this.messages.update(currentMessages => [...currentMessages, primengMessage]);
  }

  setMessages(messages: InaMessage[]): void {
    const primengMessages: Message[] = messages.map(msg => {
      const config = this.severityConfig.find(cfg => cfg.severity === msg.severity);

      return {
        severity: msg.severity,
        summary: msg.summary,
        detail: msg.detail,
        closable: msg.closable ?? this.closable,
        sticky: msg.sticky ?? this.sticky,
        key: msg.key ?? this.key,
        icon: this.enableIcon && config ? config.iconClass : undefined
      };
    });

    this.messages.set(primengMessages);
  }

  clear(): void {
    this.messages.set([]);
  }

  removeMessage(index: number): void {
    this.messages.update(currentMessages =>
      currentMessages.filter((_, i) => i !== index)
    );
  }

  private showMessage(severity: MessageSeverity, detail: string, summary?: string): void {
    this.addMessage({
      severity,
      detail,
      summary: summary || '',
      closable: this.closable,
      sticky: this.sticky,
    });
  }

  trackByFn(index: number, message: Message): string {
    return `${message.severity}-${index}`;
  }
}
