import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getUserId']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChatService,
        { provide: AuthService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    // Mock the auth service to return a user ID
    authServiceSpy.getUserId.and.returnValue('test-user-id');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get chats from the API', () => {
    const mockChats = [
      {
        chatID: '1',
        user1ID: 'test-user-id',
        user2ID: 'other-user-id',
        createdAt: new Date(),
        messages: []
      }
    ];

    service.getChats().subscribe(chats => {
      expect(chats).toEqual(mockChats);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/chat`);
    expect(req.request.method).toBe('GET');
    req.flush(mockChats);
  });

  it('should get messages for a specific chat', () => {
    const chatId = '1';
    const mockMessages = [
      {
        messageID: '1',
        chatID: chatId,
        senderID: 'test-user-id',
        messageText: 'Hello',
        sentAt: new Date(),
        isRead: false
      }
    ];

    service.getMessages(chatId).subscribe(messages => {
      expect(messages).toEqual(mockMessages);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/chat/${chatId}/messages`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMessages);
  });

  it('should send a message through the API', () => {
    const mockMessage = {
      chatID: '1',
      messageText: 'Hello',
      sentAt: new Date(),
      isRead: false
    };

    service.sendMessage(mockMessage).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/chat/messages`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockMessage);
    req.flush({ success: true });
  });

  it('should mark messages as read', () => {
    const chatId = '1';

    service.markMessagesAsRead(chatId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/chat/${chatId}/read`);
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true });
  });
});
