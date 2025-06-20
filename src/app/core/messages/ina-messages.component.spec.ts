import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InaMessagesComponent } from './ina-messages.component';
import { MessagesModule } from 'primeng/messages';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InaMessage } from './ina-messages.model';

describe('InaMessagesComponent', () => {
  let component: InaMessagesComponent;
  let fixture: ComponentFixture<InaMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InaMessagesComponent,
        MessagesModule,
        NoopAnimationsModule
      ]
    });
    fixture = TestBed.createComponent(InaMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // #constructor quand le composant est initialisé, alors il a les valeurs par défaut
  it('#constructor quand le composant est initialisé, alors il a les valeurs par défaut', () => {
    expect(component).toBeTruthy();
    expect(component.key).toBe('ina-messages');
    expect(component.closable).toBeTrue();
    expect(component.enableIcon).toBeTrue();
    expect(component.escape).toBeTrue();
    expect(component.sticky).toBeTrue();
    expect(component.life).toBe(6000);
    expect(component.messages()).toEqual([]);
  });

  // #showSuccess quand appelé avec un message, alors ajoute un message de succès
  it('#showSuccess quand appelé avec un message, alors ajoute un message de succès', () => {
    const detail = 'Success message';
    const summary = 'Success';

    component.showSuccess(detail, summary);

    expect(component.messages().length).toBe(1);
    const message = component.messages()[0];
    expect(message.severity).toBe('success');
    expect(message.detail).toBe(detail);
    expect(message.summary).toBe(summary);
  });

  // #showError quand appelé avec un message, alors ajoute un message d'erreur
  it('#showError quand appelé avec un message, alors ajoute un message d\'erreur', () => {
    const detail = 'Error message';
    const summary = 'Error';

    component.showError(detail, summary);

    expect(component.messages().length).toBe(1);
    const message = component.messages()[0];
    expect(message.severity).toBe('error');
    expect(message.detail).toBe(detail);
    expect(message.summary).toBe(summary);
  });

  // #showInfo quand appelé avec un message, alors ajoute un message d'information
  it('#showInfo quand appelé avec un message, alors ajoute un message d\'information', () => {
    const detail = 'Info message';
    const summary = 'Info';

    component.showInfo(detail, summary);

    expect(component.messages().length).toBe(1);
    const message = component.messages()[0];
    expect(message.severity).toBe('info');
    expect(message.detail).toBe(detail);
    expect(message.summary).toBe(summary);
  });

  // #showWarn quand appelé avec un message, alors ajoute un message d'avertissement
  it('#showWarn quand appelé avec un message, alors ajoute un message d\'avertissement', () => {
    const detail = 'Warning message';
    const summary = 'Warning';

    component.showWarn(detail, summary);

    expect(component.messages().length).toBe(1);
    const message = component.messages()[0];
    expect(message.severity).toBe('warn');
    expect(message.detail).toBe(detail);
    expect(message.summary).toBe(summary);
  });

  // #addMessage quand appelé avec un message, alors ajoute ce message
  it('#addMessage quand appelé avec un message, alors ajoute ce message', () => {
    const inaMessage: InaMessage = {
      severity: 'info',
      summary: 'Test',
      detail: 'Test message',
      closable: false,
      sticky: false,
      life: 3000
    };

    component.addMessage(inaMessage);

    expect(component.messages().length).toBe(1);
    const message = component.messages()[0];
    expect(message.severity).toBe(inaMessage.severity);
    expect(message.summary).toBe(inaMessage.summary);
    expect(message.detail).toBe(inaMessage.detail);
    expect(message.closable).toBe(inaMessage.closable);
    expect(message.sticky).toBe(inaMessage.sticky);
    expect(message.life).toBeUndefined();
  });

  // #setMessages quand appelé avec plusieurs messages, alors remplace tous les messages existants
  it('#setMessages quand appelé avec plusieurs messages, alors remplace tous les messages existants', () => {
    // First add a message
    component.showInfo('Initial message');
    expect(component.messages().length).toBe(1);

    // Then set new messages
    const newMessages: InaMessage[] = [
      { severity: 'info', detail: 'Info message' },
      { severity: 'warn', detail: 'Warn message' }
    ];

    component.setMessages(newMessages);

    expect(component.messages().length).toBe(2);
    expect(component.messages()[0].severity).toBe('info');
    expect(component.messages()[1].severity).toBe('warn');
  });

  // #clear quand appelé, alors supprime tous les messages
  it('#clear quand appelé, alors supprime tous les messages', () => {
    // Add some messages
    component.showInfo('Info message');
    component.showWarn('Warning message');
    expect(component.messages().length).toBe(2);

    component.clear();

    expect(component.messages().length).toBe(0);
  });

  // #removeMessage quand appelé avec un index valide, alors supprime le message à cet index
  it('#removeMessage quand appelé avec un index valide, alors supprime le message à cet index', () => {
    component.showInfo('First message');
    component.showWarn('Second message');
    component.showError('Third message');
    expect(component.messages().length).toBe(3);

    // Remove the middle message
    component.removeMessage(1);

    expect(component.messages().length).toBe(2);
    expect(component.messages()[0].detail).toBe('First message');
    expect(component.messages()[1].detail).toBe('Third message');
  });

  // #trackByFn quand appelé, alors retourne une chaîne unique pour le message
  it('#trackByFn quand appelé, alors retourne une chaîne unique pour le message', () => {
    const message = { severity: 'info', detail: 'Test' };
    const index = 5;

    const result = component.trackByFn(index, message);

    expect(result).toBe(`${message.severity}-${index}`);
  });
});
