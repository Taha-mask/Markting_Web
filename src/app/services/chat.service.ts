import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';

export interface Message {
  messageID?: string;
  chatID?: string;
  senderID?: string;
  messageText: string;
  sentAt: Date;
  isRead: boolean;
  readAt?: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  image?: string;
  reactions?: string[];
  replyTo?: {
    text: string;
    sender: string;
  };
  retryCount?: number;
}

export interface Chat {
  chatID: string;
  user1ID: string;
  user2ID: string;
  createdAt: Date;
  messages: Message[];
  otherUser?: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
    status?: string;
  };
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  private connectionStatusSource = new BehaviorSubject<string>('disconnected');
  private messageReceivedSource = new BehaviorSubject<any>(null);
  private typingStatusSource = new BehaviorSubject<{chatId: string, userId: string, isTyping: boolean} | null>(null);
  
  // Public observables
  public connectionStatus$ = this.connectionStatusSource.asObservable();
  public messageReceived$ = this.messageReceivedSource.asObservable();
  public typingStatus$ = this.typingStatusSource.asObservable();
  
  constructor(private http: HttpClient) {
    this.initializeConnection();
  }
  
  private initializeConnection(): void {
    // Get auth token
    const token = this.getAuthToken();
    
    // Build connection with proper error handling
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.chatHubUrl, { // Use the direct chatHubUrl from environment
        accessTokenFactory: () => token,
        skipNegotiation: false, // Allow negotiation to find best transport
        transport: signalR.HttpTransportType.WebSockets | 
                  signalR.HttpTransportType.ServerSentEvents | 
                  signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000]) // Reconnection strategy
      .configureLogging(signalR.LogLevel.Information)
      .build();
    
    // Set up event handlers
    this.setupSignalREventHandlers();
    
    // Start the connection
    this.startConnection();
  }
  
  private setupSignalREventHandlers(): void {
    // Connection status events
    this.hubConnection.onreconnecting(() => {
      console.log('Reconnecting to chat hub...');
      this.connectionStatusSource.next('reconnecting');
    });
    
    this.hubConnection.onreconnected(() => {
      console.log('Reconnected to chat hub');
      this.connectionStatusSource.next('connected');
    });
    
    this.hubConnection.onclose(() => {
      console.log('Connection closed');
      this.connectionStatusSource.next('disconnected');
    });
    
    // Message events
    this.hubConnection.on('ReceiveMessage', (message) => {
      console.log('Message received:', message);
      this.messageReceivedSource.next(message);
    });
    
    // Typing indicator events
    this.hubConnection.on('UserTyping', (chatId: string, userId: string, isTyping: boolean) => {
      console.log('Typing indicator received:', chatId, userId, isTyping);
      this.typingStatusSource.next({ chatId, userId, isTyping });
    });
    
    this.hubConnection.on('Connected', (data) => {
      console.log('Connected to chat hub:', data);
    });
  }
  
  private startConnection(): void {
    this.connectionStatusSource.next('connecting');
    
    this.hubConnection.start()
      .then(() => {
        console.log('Connection started successfully');
        this.connectionStatusSource.next('connected');
      })
      .catch(err => {
        console.error('Error starting connection:', err);
        this.connectionStatusSource.next('failed');
        
        // Retry after delay
        setTimeout(() => this.startConnection(), 5000);
      });
  }
  
  // Check if the SignalR connection is connected
  public isConnected(): boolean {
    return this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected;
  }
  
  // Send a message through the API
  public sendMessage(message: Message): Observable<any> {
    console.log('Sending message:', message);
    // For now, just return a mock successful response
    return of({
      success: true,
      messageId: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  }
  
  // Get chats for the current user
  public getChats(): Observable<Chat[]> {
    console.log('Getting chats');
    // Return mock data for now
    return of([
      {
        chatID: 'chat-1',
        user1ID: 'current-user',
        user2ID: 'user-1',
        createdAt: new Date(),
        messages: [],
        otherUser: {
          id: 'user-1',
          userName: 'john_doe',
          firstName: 'John',
          lastName: 'Doe',
          profilePictureUrl: 'https://via.placeholder.com/150',
          status: 'online'
        },
        lastMessage: 'Hello there!',
        lastMessageTime: new Date().toISOString(),
        unread: false
      }
    ]);
  }
  
  // Get messages for a specific chat
  public getMessages(chatId: string): Observable<Message[]> {
    console.log('Getting messages for chat:', chatId);
    // Return mock data for now
    return of([
      {
        messageID: 'msg-1',
        chatID: chatId,
        senderID: 'user-1',
        messageText: 'Hello, how are you?',
        sentAt: new Date(Date.now() - 3600000),
        isRead: true,
        status: 'delivered'
      },
      {
        messageID: 'msg-2',
        chatID: chatId,
        senderID: 'current-user',
        messageText: 'I am good, thanks!',
        sentAt: new Date(Date.now() - 1800000),
        isRead: true,
        status: 'delivered'
      }
    ]);
  }
  
  // Create a new chat with another user
  public createChat(userId: string): Observable<Chat> {
    console.log('Creating new chat with user:', userId);
    // Return mock data for now
    return of({
      chatID: `chat-${Date.now()}`,
      user1ID: 'current-user',
      user2ID: userId,
      createdAt: new Date(),
      messages: [],
      otherUser: {
        id: userId,
        userName: 'new_user',
        firstName: 'New',
        lastName: 'User',
        profilePictureUrl: 'https://via.placeholder.com/150',
        status: 'online'
      },
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unread: false
    });
  }
  
  // Mark messages as read
  public markMessagesAsRead(chatId: string): Observable<any> {
    console.log('Marking messages as read for chat:', chatId);
    // Return mock success response
    return of({ success: true });
  }
  
  // Send typing indicator
  public sendTypingIndicator(chatId: string, isTyping: boolean): void {
    if (this.isConnected()) {
      this.hubConnection.invoke('SendTypingIndicator', chatId, isTyping)
        .catch(err => console.error('Error sending typing indicator:', err));
    } else {
      console.warn('Cannot send typing indicator: not connected');
    }
  }
  
  // Retry sending a failed message
  public retryMessage(message: Message): Observable<any> {
    console.log('Retrying message:', message);
    message.status = 'sending';
    message.retryCount = (message.retryCount || 0) + 1;
    return this.sendMessage(message);
  }
  
  // Get the auth token from storage
  private getAuthToken(): string {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.token || '';
  }
  
  // Disconnect when service is destroyed
  public disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}