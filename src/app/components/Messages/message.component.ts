import { Component, ViewChild, ElementRef, HostListener, AfterViewChecked, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../../pipes/highlight.pipe';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ChatService, Chat, Message } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-message',
    imports: [CommonModule, PickerModule, FormsModule, HighlightPipe, HttpClientModule],
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewChecked, OnDestroy {
  // Chat and message data
  chatList: Chat[] = [];
  filteredChatList: Chat[] = [];
  selectedChat: Chat | null = null;
  messages: Message[] = [];
  
  // Typing indicators
  typingUsers: {[chatId: string]: {userId: string, username: string, lastTyped: Date}} = {};
  isTyping = false;
  typingTimeout: any = null;
  
  // UI state
  isLoading = true;
  isChatSelected = false;
  searchQuery = '';
  showEmojiPicker = false;
  isMenuVisible = false;
  showMoreOptions = false;
  selectedMoreOptionsIndex: number | null = null;
  showReactionPicker = false;
  selectedMessageIndex: number | null = null;
  replyingTo: any = null;
  messageText = '';
  
  // References
  @ViewChild('chatbox') private chatbox!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('searchBar') searchBar!: ElementRef;
  
  // Navigation
  lastScrollTop = 0;
  navVisible = true;
  
  // User data
  currentUserId = '';
  
  // Service data
  private apiUrl = environment.apiUrl;
  private messageSubscription: Subscription | null = null;
  private typingSubscription: Subscription | null = null;
  private connectionSubscription: Subscription | null = null;
  private typingDebounceTimer: any = null;

  // Use inject for dependency injection
  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  constructor() {
    // Share this component instance with window for navbar access
    (window as any).messageComponent = this;
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    this.subscribeToMessages();
    this.subscribeToTypingIndicators();
    this.subscribeToConnectionStatus();
    this.loadChats();
  }

  ngOnDestroy(): void {
    // Clean up when component is destroyed
    delete (window as any).messageComponent;
    
    // Unsubscribe from all subscriptions
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    
    if (this.typingSubscription) {
      this.typingSubscription.unsubscribe();
    }
    
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
    
    // Clear any timers
    if (this.typingDebounceTimer) {
      clearTimeout(this.typingDebounceTimer);
    }
    
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  
  // Subscribe to real-time messages from the chat service
  private subscribeToMessages(): void {
    this.messageSubscription = this.chatService.messageReceived$.subscribe(messageData => {
      if (messageData) {
        this.handleIncomingMessage(messageData);
      }
    });
  }
  
  // Subscribe to typing indicators
  private subscribeToTypingIndicators(): void {
    this.typingSubscription = this.chatService.typingStatus$.subscribe((status: {chatId: string, userId: string, isTyping: boolean} | null) => {
      if (status && status.userId !== this.currentUserId) {
        this.handleTypingIndicator(status.chatId, status.userId, status.isTyping);
      }
    });
  }
  
  // Subscribe to connection status
  private subscribeToConnectionStatus(): void {
    this.connectionSubscription = this.chatService.connectionStatus$.subscribe(status => {
      console.log(`SignalR connection status: ${status}`);
      
      // Update UI based on connection status
      if (status === 'connected') {
        // If reconnected, check for missed messages
        if (this.selectedChat) {
          this.refreshMessages(this.selectedChat.chatID);
        }
      } else if (status === 'reconnecting') {
        // Show reconnecting indicator (could add a visual indicator here)
        console.log('Attempting to reconnect to chat server...');
      } else if (status === 'disconnected') {
        // Show disconnected message
        console.log('Disconnected from chat server. Will try to reconnect automatically.');
      }
    });
  }
  
  // Handle typing indicator events
  private handleTypingIndicator(chatId: string, userId: string, isTyping: boolean): void {
    // Find the chat
    const chat = this.chatList.find(c => c.chatID === chatId);
    if (!chat) return;
    
    const username = chat.otherUser?.firstName || 'User';
    
    if (isTyping) {
      // Add or update typing user
      this.typingUsers[chatId] = {
        userId,
        username,
        lastTyped: new Date()
      };
      
      // Clear existing timeout
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
      
      // Set timeout to clear typing indicator after 5 seconds
      this.typingTimeout = setTimeout(() => {
        delete this.typingUsers[chatId];
      }, 5000);
    } else {
      // Remove typing user
      delete this.typingUsers[chatId];
    }
  }

  // Handle incoming messages from SignalR
  private handleIncomingMessage(messageData: Message): void {
    if (!messageData || !messageData.chatID) return;

    // Find the chat this message belongs to
    const chatIndex = this.chatList.findIndex(c => c.chatID === messageData.chatID);
    
    if (chatIndex >= 0) {
      // Check if this is a message we already have (optimistic UI update)
      const existingMessageIndex = this.chatList[chatIndex].messages.findIndex(
        m => m.messageID === messageData.messageID || 
             (m.messageID?.startsWith('temp-') && m.messageText === messageData.messageText)
      );
      
      if (existingMessageIndex >= 0) {
        // Update the existing message with server data
        const updatedMessage: Message = {
          ...this.chatList[chatIndex].messages[existingMessageIndex],
          messageID: messageData.messageID, // Replace temp ID with server ID
          status: 'delivered',
          sentAt: new Date(messageData.sentAt)
        };
        
        this.chatList[chatIndex].messages[existingMessageIndex] = updatedMessage;
      } else {
        // Add new message
        const newMessage: Message = {
          messageID: messageData.messageID,
          chatID: messageData.chatID,
          senderID: messageData.senderID,
          messageText: messageData.messageText,
          sentAt: new Date(messageData.sentAt),
          isRead: false,
          status: 'delivered'
        };

        this.chatList[chatIndex].messages.push(newMessage);
      }
      
      // Update chat preview
      this.chatList[chatIndex].lastMessage = this.getMessagePreview(messageData.messageText);
      this.chatList[chatIndex].lastMessageTime = 'Just now';
      
      // If the message is not from current user, mark as unread
      if (messageData.senderID !== this.currentUserId) {
        this.chatList[chatIndex].unread = true;
        
        // Clear typing indicator for this user
        delete this.typingUsers[messageData.chatID];
      }

      // If this is the currently selected chat, update messages
      if (this.selectedChat && this.selectedChat.chatID === messageData.chatID) {
        this.messages = [...this.chatList[chatIndex].messages];
        this.scrollToBottom();
        
        // Mark as read if it's the current chat
        this.markMessagesAsRead(messageData.chatID);
      }

      // Move this chat to the top of the list
      if (chatIndex > 0) {
        const [chat] = this.chatList.splice(chatIndex, 1);
        this.chatList.unshift(chat);
        this.filteredChatList = [...this.chatList];
      }
    } else {
      // This is a new chat, reload chats
      this.loadChats();
    }
  }
  
  // Get a preview of the message text (for chat list)
  private getMessagePreview(text: string): string {
    if (!text) return '';
    
    // Trim to 30 characters max
    return text.length > 30 ? text.substring(0, 27) + '...' : text;
  }
  
  // Refresh messages for a chat
  private refreshMessages(chatId: string): void {
    this.chatService.getMessages(chatId).subscribe({
      next: (messages: Message[]) => {
        // Find the chat
        const chatIndex = this.chatList.findIndex(c => c.chatID === chatId);
        if (chatIndex >= 0) {
          // Update messages
          this.chatList[chatIndex].messages = messages;
          
          // If this is the selected chat, update the view
          if (this.selectedChat && this.selectedChat.chatID === chatId) {
            this.messages = [...messages];
          }
        }
      },
      error: (error: any) => console.error('Error refreshing messages:', error)
    });
  }

  // Load chats from the API
  loadChats(): void {
    this.isLoading = true;
    this.chatService.getChats()
      .subscribe({
        next: (chats: Chat[]) => {
          if (chats && chats.length > 0) {
            this.chatList = this.processChats(chats);
            this.filteredChatList = [...this.chatList];
            
            // Select the first chat if available and none is selected
            if (this.chatList.length > 0 && !this.selectedChat) {
              this.selectChat(this.chatList[0]);
            }
          } else {
            console.log('No chats returned from API, loading dummy data');
            this.loadDummyData();
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading chats:', error);
          this.isLoading = false;
          
          // Load dummy data for testing if API fails
          this.loadDummyData();
        }
      });
  }

  // Process chats from API to add UI-specific properties
  private processChats(chats: Chat[]): Chat[] {
    return chats.map(chat => {
      // Determine which user is the other participant
      const otherUserId = chat.user1ID === this.currentUserId ? chat.user2ID : chat.user1ID;
      
      // Sort messages by date
      const sortedMessages = chat.messages ? 
        [...chat.messages].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()) : 
        [];
      
      // Calculate unread messages
      const hasUnread = sortedMessages.some(m => 
        m.senderID !== this.currentUserId && !m.isRead
      );
      
      // Get last message info
      const lastMessage = sortedMessages.length > 0 ? 
        sortedMessages[sortedMessages.length - 1] : null;
      
      return {
        ...chat,
        messages: sortedMessages,
        unread: hasUnread,
        lastMessage: lastMessage?.messageText || '',
        lastMessageTime: lastMessage ? this.formatMessageTime(new Date(lastMessage.sentAt)) : ''
      };
    }).sort((a, b) => {
      // Sort by latest message
      const aTime = a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].sentAt).getTime() : 0;
      const bTime = b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].sentAt).getTime() : 0;
      return bTime - aTime;
    });
  }

  // Format message time for display
  private formatMessageTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Load dummy data for testing
  private loadDummyData(): void {
    const dummyChats: Chat[] = [
      { 
        chatID: '1',
        user1ID: this.currentUserId,
        user2ID: '2',
        createdAt: new Date(),
        otherUser: {
          id: '2',
          userName: 'john_doe',
          firstName: 'John',
          lastName: 'Doe',
          profilePictureUrl: 'assets/images/avatars/user1.jpg',
          status: 'online'
        },
        messages: [
          {
            messageID: '1',
            chatID: '1',
            senderID: '2',
            messageText: 'Hello, how are you?',
            sentAt: new Date(Date.now() - 3600000),
            isRead: true
          },
          {
            messageID: '2',
            chatID: '1',
            senderID: this.currentUserId,
            messageText: 'I am good, thanks for asking!',
            sentAt: new Date(Date.now() - 1800000),
            isRead: true
          }
        ],
        unread: false,
        lastMessage: 'I am good, thanks for asking!',
        lastMessageTime: '30m ago'
      },
      { 
        chatID: '2',
        user1ID: this.currentUserId,
        user2ID: '3',
        createdAt: new Date(),
        otherUser: {
          id: '3',
          userName: 'jane_smith',
          firstName: 'Jane',
          lastName: 'Smith',
          profilePictureUrl: 'assets/images/avatars/user2.jpg',
          status: 'offline'
        },
        messages: [
          {
            messageID: '3',
            chatID: '2',
            senderID: '3',
            messageText: 'Hey, did you see the new project requirements?',
            sentAt: new Date(Date.now() - 86400000),
            isRead: true
          }
        ],
        unread: true,
        lastMessage: 'Hey, did you see the new project requirements?',
        lastMessageTime: '1d ago'
      }
    ];
    
    this.chatList = dummyChats;
    this.filteredChatList = [...dummyChats];
    
    if (dummyChats.length > 0) {
      this.selectChat(dummyChats[0]);
    }
  }

  // Send a message to the current chat
  sendMessage(text?: string): void {
    const messageToSend = text || this.messageText;
    if (!messageToSend.trim() || !this.selectedChat) return;
    
    // Stop sending typing indicator
    this.sendTypingStatus(false);
    
    const newMessage: Message = {
      messageID: `temp-${Date.now()}`,
      chatID: this.selectedChat.chatID,
      senderID: this.currentUserId,
      messageText: messageToSend.trim(),
      sentAt: new Date(),
      isRead: false,
      status: 'sending' // Mark as sending initially
    };
    
    // Add to local messages (optimistic UI update)
    if (this.selectedChat) {
      this.selectedChat.messages.push(newMessage);
      this.messages = [...this.selectedChat.messages];
    }
    
    // Reset input
    this.messageText = '';
    this.replyingTo = null;
    
    // Scroll to bottom
    this.scrollToBottom();
    
    // Find chat index
    const chatIndex = this.chatList.findIndex(c => c.chatID === this.selectedChat?.chatID);
    
    if (chatIndex >= 0) {
      this.chatList[chatIndex].lastMessage = this.getMessagePreview(newMessage.messageText);
      this.chatList[chatIndex].lastMessageTime = 'Just now';
      
      // Move chat to top
      if (chatIndex > 0) {
        const [chat] = this.chatList.splice(chatIndex, 1);
        this.chatList.unshift(chat);
        this.filteredChatList = [...this.chatList];
      }
    }
    
    // Check if we're connected to the server or in fallback mode
    const isConnectedOrFallback = this.chatService.isConnected() || environment.useFallbackMode;
    
    if (isConnectedOrFallback) {
      // Send the message to the server (or mock in fallback mode)
      this.chatService.sendMessage(newMessage)
        .subscribe({
          next: (response: any) => {
            console.log('Message sent successfully:', response);
            
            // Update message with server-generated ID if provided
            if (response && response.messageId) {
              newMessage.messageID = response.messageId;
            }
            
            // Check if this was processed in offline/fallback mode
            if (response && response.offline) {
              console.log('Message processed in offline mode');
              // Still mark as sent to maintain UI flow
              this.updateMessageStatus(newMessage.messageID, 'sent');
              // Store for potential sync later
              this.storeMessageForRetry(newMessage);
            } else {
              // Regular online processing - update message status to sent
              this.updateMessageStatus(newMessage.messageID, 'sent');
            }
          },
          error: (error: any) => {
            console.error('Error sending message:', error);
            
            // Mark message as failed
            this.updateMessageStatus(newMessage.messageID, 'failed');
            // Store the message for retry later
            this.storeMessageForRetry(newMessage);
          }
        });
    } else {
      // We're not connected and not in fallback mode
      console.warn('Not connected to server, marking message as failed');
      this.updateMessageStatus(newMessage.messageID, 'failed');
      
      // Store the message for retry when connection is restored
      this.storeMessageForRetry(newMessage);
    }
  }
  
  // Store a message for retry when connection is restored
  private failedMessages: Message[] = [];
  
  private storeMessageForRetry(message: Message): void {
    this.failedMessages.push(message);
    
    // Set up a listener to retry when connection is restored
    // This is a one-time subscription that will clean itself up
    const connectionSub = this.chatService.connectionStatus$.subscribe(status => {
      if (status === 'connected' && this.failedMessages.length > 0) {
        console.log('Connection restored, retrying failed messages');
        
        // Try to resend all failed messages
        [...this.failedMessages].forEach(msg => {
          this.retryMessage(msg.messageID);
        });
        
        // Clear the failed messages list
        this.failedMessages = [];
        
        // Unsubscribe from this listener
        connectionSub.unsubscribe();
      }
    });
  }
  
  // Update the status of a message
  private updateMessageStatus(messageId: string | undefined, status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'): void {
    if (!messageId || !this.selectedChat) return;
    
    // Find the message in the selected chat
    const messageIndex = this.selectedChat.messages.findIndex(m => m.messageID === messageId);
    
    if (messageIndex >= 0) {
      // Update the message status
      this.selectedChat.messages[messageIndex].status = status;
      
      // Update the messages array
      this.messages = [...this.selectedChat.messages];
    }
  }
  
  // Retry sending a failed message
  retryMessage(messageId: string | undefined): void {
    if (!messageId || !this.selectedChat) return;
    
    // Find the message
    const messageIndex = this.selectedChat.messages.findIndex(m => m.messageID === messageId);
    
    if (messageIndex >= 0) {
      const failedMessage = this.selectedChat.messages[messageIndex];
      
      // Update status to sending
      this.updateMessageStatus(messageId, 'sending');
      
      // Retry sending
      this.chatService.retryMessage(failedMessage)
        .subscribe({
          next: (response: any) => {
            console.log('Message sent successfully on retry', response);
            this.updateMessageStatus(messageId, 'sent');
          },
          error: (error: any) => {
            console.error('Error retrying message', error);
            this.updateMessageStatus(messageId, 'failed');
          }
        });
    }
  }
  
  // Send typing status to other users
  sendTypingStatus(isTyping: boolean): void {
    if (!this.selectedChat) return;
    
    this.chatService.sendTypingIndicator(this.selectedChat.chatID, isTyping);
  }
  
  // Handle input changes for typing indicator
  onMessageInputChange(): void {
    if (!this.selectedChat) return;
    
    // Set typing flag
    this.isTyping = true;
    
    // Clear existing timer
    if (this.typingDebounceTimer) {
      clearTimeout(this.typingDebounceTimer);
    }
    
    // Send typing indicator (debounced)
    this.typingDebounceTimer = setTimeout(() => {
      this.sendTypingStatus(true);
      
      // Set timer to stop typing indicator after 5 seconds of inactivity
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
      
      this.typingTimeout = setTimeout(() => {
        this.isTyping = false;
        this.sendTypingStatus(false);
      }, 5000);
    }, 300);
  }

  // Create a new chat with a user
  createNewChat(userId: string): void {
    if (!userId) return;
    
    this.chatService.createChat(userId)
      .subscribe({
        next: (chat: any) => {
          // Add to chat list
          this.chatList.unshift(chat);
          this.filteredChatList = [...this.chatList];
          this.selectChat(chat);
        },
        error: (error: any) => {
          console.error('Error creating chat', error);
        }
      });
  }

  // Mark messages in a chat as read
  markMessagesAsRead(chatId: string): void {
    if (!chatId) return;
    
    // Find chat
    const chatIndex = this.chatList.findIndex(c => c.chatID === chatId);
    
    if (chatIndex >= 0) {
      // Mark messages as read locally
      this.chatList[chatIndex].messages.forEach(m => {
        if (m.senderID !== this.currentUserId) {
          m.isRead = true;
          m.readAt = new Date();
          
          // Update status to read
          if (m.status === 'delivered') {
            m.status = 'read';
          }
        }
      });
      
      // Update unread status
      this.chatList[chatIndex].unread = false;
      
      // Update filtered list
      this.filteredChatList = [...this.chatList];
      
      // If this is the selected chat, update messages view
      if (this.selectedChat && this.selectedChat.chatID === chatId) {
        this.messages = [...this.chatList[chatIndex].messages];
      }
      
      // Send to API
      this.chatService.markMessagesAsRead(chatId)
        .subscribe({
          next: () => {
            console.log('Messages marked as read');
          },
          error: (error: any) => {
            console.error('Error marking messages as read', error);
          }
        });
    }
  }

  // Toggle emoji picker
  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  // Select a chat to view
  selectChat(chat: Chat): void {
    this.selectedChat = chat;
    this.isChatSelected = true;
    this.messages = chat.messages;
    
    // Mark messages as read
    if (chat.unread) {
      this.markMessagesAsRead(chat.chatID);
    }
    
    // Scroll to bottom after a short delay to ensure DOM is updated
    setTimeout(() => this.scrollToBottom(), 100);
  }

  // Go back to chat list (mobile view)
  goBackToChatList(): void {
    this.isChatSelected = false;
  }

  // Search chats
  searchChats(query: string): void {
    this.searchQuery = query;
    this.filterChats();
  }

  // Filter chats based on search query
  private filterChats(): void {
    if (!this.searchQuery.trim()) {
      this.filteredChatList = [...this.chatList];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredChatList = this.chatList.filter(chat => 
        chat.otherUser?.userName.toLowerCase().includes(query) || 
        chat.otherUser?.firstName.toLowerCase().includes(query) || 
        chat.otherUser?.lastName.toLowerCase().includes(query) || 
        (chat.lastMessage && chat.lastMessage.toLowerCase().includes(query)) ||
        chat.messages.some((msg: { messageText: string }) => msg.messageText.toLowerCase().includes(query))
      );
    }
  }

  // Scroll chat to bottom
  scrollToBottom(): void {
    try {
      if (this.chatbox && this.chatbox.nativeElement) {
        this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom', err);
    }
  }

  // Toggle attachment menu
  toggleAttachmentMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  // Attachment methods
  attachDocument(): void {
    this.triggerFileInput();
  }

  openCamera(): void {
    // Implement camera functionality
  }

  attachGallery(): void {
    this.triggerFileInput('image/*');
  }

  attachAudio(): void {
    // Implement audio attachment
  }

  attachLocation(): void {
    // Implement location sharing
  }

  attachContact(): void {
    // Implement contact sharing
  }

  createPoll(): void {
    // Implement poll creation
  }

  triggerFileInput(accept: string = '*/*'): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.accept = accept;
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    
    // Handle file upload
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const fileData = e.target?.result;
      // Implement file sending logic
      this.isMenuVisible = false;
      
      // For image preview
      if (file.type.startsWith('image/')) {
        // Handle image preview
      }
    };
    
    reader.readAsDataURL(file);
  }

  // Handle document clicks to close emoji picker and menus
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Close emoji picker if clicked outside
    if (this.showEmojiPicker && !target.closest('.emoji-mart') && !target.closest('.emoji-toggle')) {
      this.showEmojiPicker = false;
    }
    
    // Close attachment menu if clicked outside
    if (this.isMenuVisible && !target.closest('.attachment-menu') && !target.closest('.attachment-toggle')) {
      this.isMenuVisible = false;
    }
  }

  // Add emoji to message
  addEmoji(event: any): void {
    this.messageText += event.emoji.native;
    // Optionally close picker after selection
    // this.showEmojiPicker = false;
  }

  // Cancel reply
  cancelReply(): void {
    this.replyingTo = null;
  }

  // Set up reply to message
  replyToMessage(message: Message, index?: number): void {
    this.replyingTo = message;
    // Focus input
    setTimeout(() => {
      this.chatbox.nativeElement.querySelector('.message-input').focus();
    }, 0);
  }

  // Toggle more options for a message
  toggleMoreOptions(index: number, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedMoreOptionsIndex === index) {
      this.selectedMoreOptionsIndex = null;
      this.showMoreOptions = false;
    } else {
      this.selectedMoreOptionsIndex = index;
      this.showMoreOptions = true;
    }
  }

  // Toggle reaction picker for a message
  toggleReactionPicker(index: number, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedMessageIndex === index) {
      this.selectedMessageIndex = null;
      this.showReactionPicker = false;
    } else {
      this.selectedMessageIndex = index;
      this.showReactionPicker = true;
    }
  }
  
  // Toggle quick reactions for a message
  toggleQuickReactions(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.toggleReactionPicker(index);
  }

  // Close reaction picker
  closeReactionPicker(): void {
    this.showReactionPicker = false;
    this.selectedMessageIndex = null;
  }
  
  // Add reaction to a message
  addReaction(index: number, reaction: string): void {
    if (!this.messages[index]) return;
    
    const message = this.messages[index];
    if (!message.reactions) {
      message.reactions = [];
    }
    
    // Toggle reaction - add if not present, remove if already there
    const reactionIndex = message.reactions.indexOf(reaction);
    if (reactionIndex === -1) {
      message.reactions.push(reaction);
    } else {
      message.reactions.splice(reactionIndex, 1);
    }
    
    // Close reaction picker
    this.closeReactionPicker();
    
    // TODO: Send reaction update to server
  }
  
  // Forward message to another chat
  forwardMessage(message: Message): void {
    // TODO: Implement forwarding functionality
    console.log('Forward message:', message);
    this.toggleMoreOptions(this.selectedMoreOptionsIndex as number);
  }
  
  // Copy message text to clipboard
  copyMessage(message: Message): void {
    navigator.clipboard.writeText(message.messageText)
      .then(() => {
        console.log('Message copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy message: ', err);
      });
    this.toggleMoreOptions(this.selectedMoreOptionsIndex as number);
  }
  
  // Unsend/delete a message
  unsendMessage(index: number): void {
    if (!this.messages[index]) return;
    
    const message = this.messages[index];
    if (message.senderID !== this.currentUserId) return;
    
    // Remove from UI
    this.messages.splice(index, 1);
    
    // Close more options menu
    this.toggleMoreOptions(this.selectedMoreOptionsIndex as number);
    
    // TODO: Send delete request to server
    console.log('Message deleted:', message);
  }
}
