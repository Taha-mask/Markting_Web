import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageComponent } from './message.component';
import { HighlightPipe } from '../../pipes/highlight.pipe';
import { of } from 'rxjs';

// Mock SignalR since we don't have the actual package
class MockHubConnectionBuilder {
  withUrl() {
    return {
      build: () => ({
        start: () => Promise.resolve(),
        on: () => {},
        invoke: () => Promise.resolve()
      })
    };
  }
}

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MessageComponent,
        HighlightPipe
      ],
      providers: [
        { provide: 'HubConnectionBuilder', useClass: MockHubConnectionBuilder }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    
    // Mock the ChatService methods
    spyOn(component['chatService'], 'getChats').and.returnValue(of([]));
    spyOn(component['chatService'], 'sendMessage').and.returnValue(of({}));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty chat list', () => {
    expect(component.chatList.length).toBe(0);
  });

  it('should filter chats when searching', () => {
    // Arrange
    component.chatList = [
      {
        chatID: '1',
        user1ID: 'currentUser',
        user2ID: 'user1',
        createdAt: new Date(),
        messages: [],
        otherUser: {
          id: 'user1',
          userName: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          profilePictureUrl: '/assets/images/default-avatar.png',
          status: 'online'
        },
        lastMessage: 'Hello there',
        lastMessageTime: new Date().toISOString(),
        unread: false
      },
      {
        chatID: '2',
        user1ID: 'currentUser',
        user2ID: 'user2',
        createdAt: new Date(),
        messages: [],
        otherUser: {
          id: 'user2',
          userName: 'janesmith',
          firstName: 'Jane',
          lastName: 'Smith',
          profilePictureUrl: '/assets/images/default-avatar.png',
          status: 'offline'
        },
        lastMessage: 'How are you?',
        lastMessageTime: new Date().toISOString(),
        unread: true
      }
    ];
    component.filteredChatList = [...component.chatList];

    // Act
    component.searchQuery = 'Jane';
    component.searchChats('Jane');

    // Assert
    expect(component.filteredChatList.length).toBe(1);
    expect(component.filteredChatList[0].otherUser?.firstName).toBe('Jane');
  });

  it('should toggle emoji picker', () => {
    // Initially false
    expect(component.showEmojiPicker).toBeFalse();
    
    // Toggle on
    component.toggleEmojiPicker();
    expect(component.showEmojiPicker).toBeTrue();
    
    // Toggle off
    component.toggleEmojiPicker();
    expect(component.showEmojiPicker).toBeFalse();
  });

  it('should toggle attachment menu', () => {
    // Initially false
    expect(component.isMenuVisible).toBeFalse();
    
    // Toggle on
    component.toggleAttachmentMenu();
    expect(component.isMenuVisible).toBeTrue();
    
    // Toggle off
    component.toggleAttachmentMenu();
    expect(component.isMenuVisible).toBeFalse();
  });

  it('should go back to chat list on mobile', () => {
    // Set up mobile view with selected chat
    component.isChatSelected = true;
    
    // Call the method
    component.goBackToChatList();
    
    // Should reset to chat list view
    expect(component.isChatSelected).toBeFalse();
  });
});